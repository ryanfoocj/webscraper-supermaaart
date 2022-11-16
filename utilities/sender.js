const { MongoClient } = require("mongodb");
const fs = require("fs/promises");

const uri = MONGO_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    let parsedData = [];
    await client.connect();
    await fs.readFile("./data/toiletroll.json").then((data) => {
      parsedData = JSON.parse(data);
      const db = client.db("supermarkettest");
      const coll = db.collection("toiletroll");
      coll
        .insertMany(parsedData)
        .then(() => {
          console.log("Data has been inserted");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
    await client.close();
  }
}

run();
