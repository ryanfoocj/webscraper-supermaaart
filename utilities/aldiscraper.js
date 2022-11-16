const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs/promises");

async function getBreadPrice() {
  try {
    const siteUrl = "https://www.iceland.co.uk/bakery/bread/white-bread";

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector = "#primary > div.search-result-content > ul > li";

    let breadObj = {};
    let breadArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 4) {
        const siteLink = $(parentElem).find(".thumb-link").attr("href");
        const pictureLink = $(parentElem).find("img").attr("data-src");
        const name = $(parentElem).find(".name-link").children("span").text();
        let price = $(parentElem)
          .find(".product-sales-price")
          .children("span")
          .text();

        price = price.substring(1); // for now keep price as string because parseFloat removes trailing 0s

        const description = "";

        breadObj = {
          name,
          description,
          price,
          siteLink,
          pictureLink,
          category: "bread",
          supermarket: "iceland",
        };
        breadArr.push(breadObj);
      }
    });

    fs.readFile("../data/bread.json").then((data) => {
      const parsedData = JSON.parse(data);
      breadArr.forEach((bread) => {
        parsedData.push(bread);
      });
      console.log(parsedData);
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("../data/bread.json", returnData, "utf-8").catch((err) => {
        console.log(err);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

getBreadPrice();
