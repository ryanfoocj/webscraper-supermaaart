const fs = require("fs/promises");
const { parse } = require("path");

const collateProducts = async () => {
  const categories = ["milk", "eggs", "pasta", "toiletroll"];
  await fs
    .readFile("../data/bread.json")
    .then((data) => {
      return JSON.parse(data);
    })
    .then((parsedData) => {
      fs.writeFile("../data/products.json", JSON.stringify(parsedData)).then(
        () => {
          console.log("Products overwritten and bread inserted");
        }
      );
    });

  categories.map(async (category) => {
    fs.readFile(`../data/${category}.json`)
      .then((data) => {
        const parsedData = JSON.parse(data);
        return parsedData;
      })
      .then((parsedData) => {
        fs.readFile("../data/products.json")
          .then((productData) => {
            const parsedProducts = JSON.parse(productData);
            parsedData.map((item) => {
              parsedProducts.push(item);
              return parsedProducts;
            });
            return parsedProducts;
          })
          .then((parsedProducts) => {
            fs.writeFile(
              "../data/products.json",
              JSON.stringify(parsedProducts)
            ).then(() => {
              console.log(`${category} inserted!`);
            });
          });
      });
  });
};

collateProducts();
