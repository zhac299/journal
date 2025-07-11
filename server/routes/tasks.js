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

// This section will help you get a list of all 'other' type of tasks-- GET
router.get("/other", async (req, res) => {
    let collection = await db.collection("tasks");
    let results = await collection.find({}).toArray();
    // Filter results to only include tasks of type 'other'
    results = results.filter(task => task.type === "other");
    res.send(results).status(200);
});

export default router;