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
          "Creamfields Uht Skimmed Milk 1 Litre": 299914291,
          "Dairy Pride Uht Skimmed Milk 1 Litre": 308100946,
          "Creamfields Uht Semi Skimmed Milk 1 Litre": 299914279,
          "Lactofree Milk Longlife Portions 5X20ml": 267309503,
          "Tesco Skimmed Milk 568Ml/1 Pint": 251314095,
        };
        const prodImg = {
          299914291:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/20ed9476-d671-41c1-897f-548a7d8aca43/e6d4c381-ea17-4c77-bc81-4a826bfa9ba0_726184814.jpeg?h=540&w=540",
          308100946:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/d2fdb6c5-897e-42b6-97ce-3694e015cdf3/d3632bad-28c4-4448-9d18-36a98474b0fb_2123041940.jpeg?h=540&w=540",
          299914279:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/9dc25e10-6d3c-4e4d-8698-74c06e932892/5558a634-c0cd-4e96-8e4e-8eeda8884fde_401745111.jpeg?h=540&w=540",
          267309503:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/38d5cfae-0ea4-43e8-94ad-322fb239b124/f9e7f10a-dbc2-4355-956e-704f2032d402.jpeg?h=540&w=540",
          251314095:
            "https://digitalcontent.api.tesco.com/v2/media/ghs/6e2f4753-eab4-4449-a1e0-4b43ac6a7d08/36b5b284-a1e9-4961-98fc-358259dec91f.jpeg?h=540&w=540",
        };
        const prodDesc = {
          299914291: "UHT skimmed milk.",
          308100946: "Ultra Heat Treated Skimmed Milk",
          299914279: "UHT homogenised semi skimmed milk.",
          267309503:
            "Lactose Free UHT Homogenised Standardised Semi Skimmed Filtered Milk Drink",
          251314095: "Pasteurised skimmed milk.",
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
          category: "milk",
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

async function WebScrapingLocalTestMilk() {
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "https://www.tesco.com/groceries/en-GB/shop/fresh-food/milk-butter-and-eggs/milk?sortBy=price-ascending"
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

setTimeout(WebScrapingLocalTestMilk, 5000);
console.log("Milk updated (Tesco)");
