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

// POST - update specific task position
router.post("/:id/order/:pos", async (req, res) => {
  try {
    let collection = await db.collection("tasks");
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $set: { position: parseInt(req.params.pos) } };
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating task position");
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
