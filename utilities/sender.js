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
      const currentPrice = product.priceHistory[0].price;
      let falsePrice =
        Math.ceil(
          Math.random() *
            (currentPrice + 1 - (currentPrice - 1) + (currentPrice - 0.5)) *
            10
        ) / 10;
      falsePrice = falsePrice.toFixed(2);
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
                      updateDate: "Nov 21|12:00pm",
                      price: falsePrice,
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
//updateDate: moment().format("MMM Do[|]hh:mma")
//price: product.priceHistory[0].price
module.exports = sender;
