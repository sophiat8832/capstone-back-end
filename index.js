// import express from "express";
// import cors from "cors";
// import "./loadEnvironment.js";
// import records from "./routes/record.js";

const express = require("express");
const cors = require("cors");
require("./loadEnvironment");
const records = require("./routes/record");

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});