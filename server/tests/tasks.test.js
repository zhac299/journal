import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

const mockTasks = [
    { _id: '1', name: 'T1', type: 'routine', done: false, routine: { monday: false }, position: 0 },
    { _id: '2', name: 'T2', type: 'wip', done: true, position: 0 }
];

// Mock DB
jest.mock('../db/connection.js', () => {
    return {
        __esModule: true,
        default: {
            collection: jest.fn().mockImplementation(() => ({
                find: jest.fn().mockImplementation(() => ({
                    sort: jest.fn().mockImplementation(() => ({
                        toArray: jest.fn().mockResolvedValue(mockTasks)
                    }))
                })),
                findOne: jest.fn().mockResolvedValue(mockTasks[0]),
                updateOne: jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
                bulkWrite: jest.fn().mockResolvedValue({ insertedCount: 0, modifiedCount: 1 }),
                insertOne: jest.fn().mockResolvedValue({ insertedId: '3' }),
                deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
            })),
        }
    };
});

jest.mock('mongodb', () => ({
  ObjectId: jest.fn(id => id),
}));

import tasks from '../routes/tasks.js';

const app = express();
app.use(express.json());
app.use('/tasks', tasks);

describe('Tasks API', () => {
    it('GET /tasks should return all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTasks);
    });

    it('GET /tasks/routine should return routine tasks', async () => {
        const res = await request(app).get('/tasks/routine');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTasks);
    });

    it('GET /tasks/other/wip should return WIP tasks', async () => {
        const res = await request(app).get('/tasks/other/wip');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTasks);
    });

    it('GET /tasks/other/nwip should return other tasks', async () => {
        const res = await request(app).get('/tasks/other/nwip');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockTasks);
    });

    it('PATCH /tasks/:id/done should update done status', async () => {
        const res = await request(app)
            .patch('/tasks/1/done')
            .send({ done: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body.modifiedCount).toBe(1);
    });

    it('PATCH /tasks/:id/routine should update routine day', async () => {
        const res = await request(app)
            .patch('/tasks/1/routine')
            .send({ day: 'monday', value: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body.modifiedCount).toBe(1);
    });

    it('POST /tasks/updatePositions should update positions', async () => {
        const res = await request(app)
            .post('/tasks/updatePositions')
            .send({ tasks: [{ id: '1', position: 0 }] });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Positions updated");
    });

    it('POST /tasks should create a new task', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ name: 'New Task', type: 'wip' });

        expect(res.statusCode).toEqual(201);
        expect(res.body._id).toBe('3');
        expect(res.body.name).toBe('New Task');
    });

    it('PATCH /tasks/:id should update task details', async () => {
        const res = await request(app)
            .patch('/tasks/1')
            .send({ name: 'Updated Name', type: 'routine' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('T1'); // returns mocked findOne task
    });

    it('DELETE /tasks/:id should delete task', async () => {
        const res = await request(app)
            .delete('/tasks/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Task deleted successfully");
    });
});
