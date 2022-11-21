const { MongoClient } = require("mongodb");

const moment = require("moment");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function sender(data) {
  try {
    await client.connect();

    const db = client.db("scrapedtest");
    const coll = db.collection("products");

    data.map((product) => {
      coll.updateOne(
        {
          name: product.name,
          supermarket: product.supermarket,
          description: product.description,
        },
        [
          {
            $set: {
              name: product.name,
              pictureLink: product.pictureLink,
              siteLink: product.siteLink,
              description: product.description,
              category: product.category,
              supermarket: product.supermarket,
              price: product.priceHistory[0].price,
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
        ],
        {
          upsert: true,
        }
      );
    });
  } catch (err) {
    console.log(err);
    await client.close();
  }
}

module.exports = sender;
