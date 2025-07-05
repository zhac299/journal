import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id
import { ObjectId } from "mongodb";

// router is an isntance of the express router
// We use it to define our routes
// The router will be added as a middleware and will take control of requests starting with path /tasks
const router = express.Router();

// This section will help you get a list of all routine items -- GET
router.get("/", async (req, res) => {
    let collection = await db.collection("tasks");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default router;