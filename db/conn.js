// import { MongoClient } from "mongodb";

const wrapper = {db: null};

(async () => {

  const mongodb = require("mongodb");
  const { MongoClient } = mongodb;

  const connectionString = process.env.ATLAS_URI || "";

  const client = new MongoClient(connectionString);

  let conn;
  try {
    conn = await client.connect();
  } catch (e) {
    console.error("THIS IS THE ERROR!!!!", e);
  }

  let db = conn.db("capstonedb");

  // export default db;
  wrapper.db = db;
  
})();
// module.exports = db;
module.exports = wrapper;