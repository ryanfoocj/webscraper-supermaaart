const express = require("express");
const { Builder, By } = require("selenium-webdriver");
const moment = require("moment");
const sender = require("./sender");

/*
const app = express()
const port = 3001
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
          "Tesco Luxury Soft Toilet Tissue White 4 Roll": 281055580,
          "Aria Essentials Toilet Tissue 6 Roll 400 Sheets": 305944361,
          "Spring Force Toilet Tissue 6 White Double Rolls": 309753465,
          "Andrex Classic Clean Toilet Tissue 4 Rolls": 309762431,
          "Tesco Luxury Soft White Toilet Tissue 6 Long Rolls": 312214351,
        };
        const prodImg = {
          281055580:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/26c90548-4c26-4929-9a64-38e9f962aa01/1b813dd2-37e2-4c65-a366-b347e0114a9c.jpeg?h=540&w=540",
          305944361:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/6f5f1fbf-1573-4aa8-992f-a06a4cea422b/2674dc33-7b05-4e6e-ab4e-ccacdaf008cd_1774816209.jpeg?h=540&w=540",
          309753465:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/2915ce65-25b9-44eb-9475-443fc4617107/05763154-6856-49d6-bb2d-e40f32483111_815555519.jpeg?h=540&w=540",
          309762431:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/b4b97566-51c3-46c8-92af-283fd2054df3/6678d277-aa87-498f-b0f1-ba82d83d6ed3_517079285.jpeg?h=540&w=540",
          312214351:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/6d57bb4e-cef2-4dd1-b9cf-b5826b808447/c81e8f87-a6f3-4a44-afbe-43da2b2ebaf4.jpeg?h=540&w=540",
        };
        const prodDesc = {
          281055580: "Luxury Soft toilet tissue 4 rolls.",
          305944361: "Aria Essentials T/Tissue 6 Roll 400 Sheets",
          309753465: "Springforce Toilet Tissue",
          309762431: "Andrex Classic Clean Toilet Tissue 4 Rolls",
          312214351: "Luxury Soft toilet tissue 6 long rolls",
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
        const notStocked = dataBlocks.indexOf(
          "This product's currently out of stock"
        );
        if (notStocked > -1) {
            delete dataBlocks //[4] = "currently out of stock";
        }
        if(dataBlocks){
        const name = dataBlocks[0];
        const id = prodNumbers[name];
        const price = dataBlocks[4].substring(1);
        const description = prodDesc[id];
        const siteLink = `https://www.tesco.com/groceries/en-GB/products/${id}}`;
        const pictureLink = prodImg[id];

        if(price[0] === "£") {
        elementDetails.push({
          name: name ?? "",
          description: description ?? "",
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          price: price ?? "",
          siteLink: siteLink ?? "",
          pictureLink: pictureLink ?? "",
          category: "toiletroll",
          supermarket: "tesco",
        });
        }
        }
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

async function WebScrapingLocalTestToiletRoll() {
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "https://www.tesco.com/groceries/en-GB/shop/household/toilet-roll/standard-toilet-roll?sortBy=price-ascending"
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

setTimeout(WebScrapingLocalTestToiletRoll, 40000);
console.log("ToiletRoll updated (Tesco)");
