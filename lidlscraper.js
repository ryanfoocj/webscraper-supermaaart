const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs/promises");

async function getToiletRollPrice() {
  try {
    const siteUrl = "https://www.lidl.co.uk/c/floralys/c87";

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);

    const elemSelector =
      "#pageMain > div > div.nuc-a-wrapper > div > div > div > div > div > article ";

    let itemObj = {};
    let itemArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      const linkStr = "https://www.lidl.co.uk/";
      const siteLink = linkStr + $(parentElem).children("a").attr("href");

      const pictureLink = $(parentElem).find("img").attr("src");
      let name = $(parentElem).find("h3").text();
      name = name.replace(/\s\s+/g, " ").trim();

      let description = $(parentElem).find(".ret-o-card__content").text();
      description = description.replace(/\s\s+/g, " ").trim();

      let price = $(parentElem).find(".lidl-m-pricebox__price").text();
      price = parseFloat(price.substring(1));

      itemObj = {
        name,
        description,
        price,
        siteLink,
        pictureLink,
        category: "toiletroll",
      };
      itemArr.push(itemObj);
    });
    fs.readFile("./data/toiletroll.json").then((data) => {
      const parsedData = JSON.parse(data);
      itemArr.forEach((item) => {
        parsedData.push(item);
      });
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("./data/toiletroll.json", returnData, "utf-8").catch(
        (err) => {
          console.log("Could not write");
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
}

async function getBreadPrice() {}

getToiletRollPrice();
