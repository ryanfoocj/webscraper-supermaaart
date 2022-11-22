const express = require("express");
const { Builder, By } = require("selenium-webdriver");
const moment = require("moment");
const sender = require("./sender");

/*
const app = express()
const port = 3000
app.get('/', async (request, response) => {
    //code
    try {
        const data = await WebScrapingLocalTest();
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({
            message: 'server error occurred',
        });
    }
})
*/

async function getElements(elements) {
  let count = 1;
  let elementDetails = [];
  try {
    while (count < 6) {
      for (const element of elements) {
        //these elements can only be retrieved with product numbers
        const prodNumbers = {
          "Hearty Food Co. Spaghetti Pasta 500G": 297844134,
          "Hearty Food Co. Penne Pasta 500G": 297844111,
          "Tesco Margheritine Soup Pasta 250G": 277017009,
          "Tesco Lasagne Pasta 500G": 250211327,
          "Tesco Tagliatelle Pasta 500G": 250211356,
        };
        const prodDesc = {
          297844134:
            "Dried spaghetti pasta made from durum wheat semolina and wheat flour.",
          297844111:
            "Dried penne pasta made from durum wheat semolina and wheat flour.",
          277017009: "Dried margheritine pasta made from durum wheat semolina.",
          250211327: "Dried lasagne pasta made from durum wheat semolina.",
          250211356:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/7d0292bf-435e-4611-aaab-765588d98d5f/b97baf45-d688-4cfa-93c7-c3af21d832df_918815770.jpeg?h=540&w=540",
        };
        const prodImg = {
          297844134:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/0021228a-cda2-4239-a591-aa8985b2ead8/0730a509-b569-4057-a8cf-c563ba0e31b8_135498198.jpeg?h=540&w=540",
          297844111:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/45784820-0352-41f8-8fd3-a83787b549d2/64ded30e-93a1-441a-b170-335fed5e1a2c_1977549637.jpeg?h=540&w=540",
          277017009:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/a2930aa6-1978-4040-85cf-2c85bc7b64e7/84fbc9ec-5009-4b25-8e83-31188b8d8912_1839662721.jpeg?h=540&w=540",
          250211327:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/3d529bc4-3c99-4c52-8dfc-ce2154217046/3b1cbd86-a340-4d01-84b3-d3f8665c0987_1597783851.jpeg?h=540&w=540",
          250211356: "Dried tagliatelle pasta made from durum wheat semolina.",
        };

        const data = await element
          .findElement(
            By.css(`li.product-list--list-item:nth-child(${count}) > div > div`)
          )
          .getText();
        const dataBlocks = data.split(`\n`);
        //cutting elements that alter output parity
        if (dataBlocks.indexOf("Write a review")) {
          const review = dataBlocks.indexOf("Write a review");
          if (review > -1) {
            dataBlocks.splice(review, 1);
          }
        }
        if (dataBlocks.indexOf("Aldi Price Match")) {
          const aldiPriceMatch = dataBlocks.indexOf("Aldi Price Match");
          if (aldiPriceMatch > -1) {
            dataBlocks.splice(aldiPriceMatch, 1);
          }
        }
        if (
          dataBlocks.indexOf(
            "This product is available for deliveries from 1pm"
          )
        ) {
          const delivery = dataBlocks.indexOf(
            "This product is available for deliveries from 1pm"
          );
          if (delivery > -1) {
            dataBlocks.splice(delivery, 1);
          }
        }
        if (dataBlocks.indexOf("Low Everyday Price")) {
          const delivery = dataBlocks.indexOf("Low Everyday Price");
          if (delivery > -1) {
            dataBlocks.splice(delivery, 1);
          }
        }
        if (dataBlocks.indexOf("Clubcard Price")) {
          const delivery = dataBlocks.indexOf("Clubcard Price");
          if (delivery > -1) {
            dataBlocks.splice(delivery, 1);
          }
        }
        const deal = dataBlocks.indexOf(
          "Buy Dolmio Sauce 470g/500g and Save 95p on Tesco Core Pasta 500g Clubcard Price"
        );
        if (deal > -1) {
          dataBlocks[4] = dataBlocks[6];
        }
        const notStocked = dataBlocks.indexOf(
          "This product's currently out of stock"
        );
        if (notStocked > -1) {
          dataBlocks[4] = "currently out of stock";
        }

        const name = dataBlocks[0];
        const id = prodNumbers[name];
        const price = dataBlocks[4].substring(1);
        const description = prodDesc[id];
        const siteLink = `https://www.tesco.com/groceries/en-GB/products/${id}}`;
        const pictureLink = prodImg[id];

        elementDetails.push({
          name: name ?? "",
          description: description ?? "",
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          price: price ?? "",
          siteLink: siteLink ?? "",
          pictureLink: pictureLink ?? "",
          category: "pasta",
          supermarket: "tesco",
        });
      }
      count++;
    }
  } catch (error) {
    console.log(error);
  }
  return elementDetails;
}

/*
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
*/

async function WebScrapingLocalTestPasta() {
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "https://www.tesco.com/groceries/en-GB/shop/food-cupboard/dried-pasta-rice-noodles-and-cous-cous/pasta-and-spaghetti?sortBy=price-ascending"
    );

    const allElements = await driver.findElements(By.css(".product-list"));

    return await getElements(allElements).then((elementDetails) =>
      sender(elementDetails)
    );
  } catch (error) {
    throw new Error(error);
  } finally {
    await driver.quit();
  }
}
setTimeout(WebScrapingLocalTestPasta, 10000);
console.log("Pasta updated (Tesco)");
