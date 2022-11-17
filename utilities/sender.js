const { MongoClient } = require("mongodb");
const fs = require("fs/promises");
const moment = require("moment");

const uri = "";

const client = new MongoClient(uri);

//write a function to backup the current grocery files before writing new ones

/* async function run() {
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
} */

async function run() {
  try {
    let parsedData = [];
    await client.connect();
    await fs.readFile("../data/toiletroll.json").then(
      (data) => {
        parsedData = JSON.parse(data);
        const db = client.db("supermarkettest");
        const coll = db.collection("toiletroll");

        parsedData.map((product) => {
          coll.updateOne(
            {
              name: product.name,
              supermarket: product.supermarket,
              description: product.description,
            },
            [
              {
                $set: {
                  priceHistory: {
                    $concatArrays: [
                      {
                        $ifNull: ["$priceHistory", []],
                      },
                      [
                        {
                          updateDate: moment().format("MMM Do[|]hh:mma"),
                          price: product.priceHistory[0].price,
                        },
                      ],
                    ],
                  },
                },
              },
            ]
          );
        });
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(err);
    await client.close();
  }
}
run();
