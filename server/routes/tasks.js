import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all tasks
router.get("/", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).sort({ position: 1 }).toArray();
  res.send(results).status(200);
});

// GET 'other' (non-WIP, non-routine) tasks
router.get("/other/nwip", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({ type: "other" }).sort({ position: 1 }).toArray();
  res.send(results).status(200);
});

// GET WIP tasks
router.get("/other/wip", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({ type: "wip" }).sort({ position: 1 }).toArray();
  res.send(results).status(200);
});

// GET routine tasks
router.get("/routine", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({ type: "routine" }).sort({ position: 1 }).toArray();
  res.send(results).status(200);
});

// GET single task by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("tasks");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// PATCH - toggle done status
router.patch("/:id/done", async (req, res) => {
  try {
    let collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const { done } = req.body;

    let result = await collection.updateOne(query, { $set: { done: done } });
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating done status");
  }
});

// PATCH - update a routine day checkbox
router.patch("/:id/routine", async (req, res) => {
  try {
    let collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const { day, value } = req.body;

    let result = await collection.updateOne(query, { $set: { [`routine.${day}`]: value } });
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating routine day");
  }
});

// POST - create a new task
router.post("/", async (req, res) => {
  try {
    const collection = await db.collection("tasks");
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).send("Name and type are required");
    }

    const siblingTasks = await collection.find({ type }).sort({ position: 1 }).toArray();
    const maxPosition = siblingTasks.reduce((max, task) => Math.max(max, task.position || 0), -1);
    const position = maxPosition + 1;

    const newTask = {
      name,
      type,
      done: false,
      position,
    };

    if (type === "routine") {
      newTask.routine = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      };
    }

    const result = await collection.insertOne(newTask);
    res.status(201).send({ _id: result.insertedId, ...newTask });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).send("Error creating task");
  }
});

// PATCH - update a task (name and/or type)
router.patch("/:id", async (req, res) => {
  try {
    const collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const { name, type } = req.body;

    const currentTask = await collection.findOne(query);
    if (!currentTask) {
      return res.status(404).send("Task not found");
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;

    const updateObj = { $set: updateData };

    if (type !== undefined && type !== currentTask.type) {
      updateData.type = type;
      
      const siblingTasks = await collection.find({ type }).sort({ position: 1 }).toArray();
      const maxPosition = siblingTasks.reduce((max, task) => Math.max(max, task.position || 0), -1);
      updateData.position = maxPosition + 1;

      if (type === "routine") {
        updateData.routine = {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        };
      } else {
        updateObj.$unset = { routine: "" };
      }
    }

    await collection.updateOne(query, updateObj);
    const updatedTask = await collection.findOne(query);
    res.status(200).send(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Error updating task");
  }
});

// DELETE - delete a task
router.delete("/:id", async (req, res) => {
  try {
    const collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send("Task not found");
    }
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task");
  }
});

// POST - bulk update positions (for drag-and-drop reordering)
router.post("/updatePositions", async (req, res) => {
  try {
    let collection = await db.collection("tasks");
    const { tasks } = req.body;

    const operations = tasks.map(task => ({
      updateOne: {
        filter: { _id: new ObjectId(task.id) },
        update: { $set: { position: task.position } }
      }
    }));

    if (operations.length > 0) {
      await collection.bulkWrite(operations);
    }

    res.status(200).send({ message: "Positions updated" });
  } catch (err) {
    console.error("Error updating positions:", err);
    res.status(500).send("Error updating positions");
  }
});

export default router;
