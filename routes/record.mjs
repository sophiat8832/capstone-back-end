import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);



const router = express.Router();

// This section will help you get a list of all the records.
router.get("/get-users", async (req, res) => {
    console.log("Testing")
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();

    console.log("THIS IS COLLECTION", collection)
    console.log("THIS IS RESULTS", results)
    res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/get-users/:id", async (req, res) => {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/new-user", async (req, res) => {
    let newDocument = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        friends: [],
        recommendations: [],
        savedList: []
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/get-users/:username/:field", async (req, res) => {
    const query = { username: req.params.username };
    let updates;
    if (req.params.field === "friends") {
        updates = {
            $push: {
                friends: req.body.friends
            }
        };
    }

    if (req.params.field === "recommendations") {
        updates = {
            $push: {
                recommendations: req.body.recommendations
            }
        };
    }

    if (req.params.field === "savedList") {
        updates = {
            $push: {
                savedList: req.body.savedList
            }
        };
    }

    let collection = await db.collection("users");
    let result = await collection.updateMany(query, updates);
    console.log("THIS IS COLLECTION", collection);
    console.log("THIS IS RESULT", result)

    res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});


// *********** RESTAURANT COLLECTION ******************

// This section will help you get a list of all the records.
router.get("/get-restaurants", async (req, res) => {
    console.log("Testing")
    let collection = await db.collection("restaurants");
    let results = await collection.find({}).toArray();

    console.log("THIS IS COLLECTION", collection)
    console.log("THIS IS RESULTS", results)
    res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/get-restaurants/:id", async (req, res) => {
    let collection = await db.collection("restaurants");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/new-restaurant", async (req, res) => {

    const YELP_API = process.env.YELP_API_KEY;
    const sdk = require('api')('@yelp-developers/v1.0#29blk6qj5xa');
    sdk.auth(`Bearer ${YELP_API}`);

    let searchRestaurant = {
        location: req.body.location,
        term: req.body.term,
    };

    sdk.v3_business_search(searchRestaurant)
        .then(({ data }) => {
            let collection = db.collection("restaurants");
            let result = collection.insertOne(data.businesses[0]);
            res.send(data.businesses[0]).status(204);
        })
        .catch(err => {
            console.error(err);
            res.send("Error occurred while fetching restaurant data").status(500);
        });
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
        $set: {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level
        }
    };

    let collection = await db.collection("restaurants");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("restaurants");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});

export default router;