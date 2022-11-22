const { MongoClient } = require("mongodb");

/* const uri = process.env.MONGO_URI;

const client = new MongoClient(uri); */

/* async function update() {
  try {
    await client.connect();

    const db = client.db("DEMO-DATABASE");
    const coll = db.collection("products");

    coll.find().forEach((item) => {
      coll.updateOne(
        { _id: item._id },
        { $set: { rating: Math.floor(Math.random() * (6 - 1) + 1) } }
      );
    });
  } catch (err) {
    console.log(err);
    await client.close();
  }
} */
//( * 10) / 10)

console.log(Math.ceil(Math.random() * (6 - 1) * 10) / 10);

module.exports = update();
