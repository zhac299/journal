import express from 'express';
import cors from 'cors';
import tasks from './routes/tasks.js';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/tasks', tasks);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});