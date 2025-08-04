import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// router is an isntance of the express router
// We use it to define our routes
// The router will be added as a middleware and will take control of requests starting with path /tasks
const router = express.Router();

// This section will help you get a list of all tasks -- GET
router.get("/", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a list of all 'other' type of tasks which are not in WIP-- GET
router.get("/other/nwip", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  // Filter results to only include tasks of type 'other' and inWIP == false
  results = results.filter((task) => task.type === "other");
  res.send(results).status(200);
});

// This section will help you get a list of all wip tasks which are not routine -- GET
router.get("/other/wip", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  // Filter results to only include tasks of type 'wip'
  results = results.filter((task) => task.type === "wip");
  res.send(results).status(200);
});

// This section will help you get a list of all 'routine' type of tasks -- GET
router.get("/routine", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  // Filter results to only include tasks of type 'routine'
  results = results.filter((task) => task.type === "routine");
  res.send(results).status(200);
});

// This section will help you get a specific task based on id -- GET
router.get("/:id", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  const id = req.params.id;
  // Filter results to only include task with specified id
  results = results.filter((task) => task._id === id);
  res.send(results).status(200);
});

router.post("/:id/order/:pos", async (req, res) => {
  let collection = await db.collection("tasks");
  let results = await collection.find({}).toArray();
  const id = req.params.id;
  const pos = req.params.pos;
  // Filter results to only include task with specified id
  results = results.filter((task) => task._id === id);
  results.forEach((task) => {
    task.position = pos;
  });
  console.log(results);
  res.send(results).status(200);
});

export default router;
