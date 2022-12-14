const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const moment = require("moment");
const { MongoClient } = require("mongodb");
const sender = require("./sender");

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

    let toiletRollObj = {};
    let toiletRollArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 4) {
        const linkStr = "https://www.lidl.co.uk/";
        const siteLink = linkStr + $(parentElem).children("a").attr("href");

        const pictureLink = $(parentElem).find("img").attr("src");
        let name = $(parentElem).find("h3").text();
        name = name.replace(/\s\s+/g, " ").trim();

        let description = $(parentElem).find(".ret-o-card__content").text();
        description = description.replace(/\s\s+/g, " ").trim();

        let price = $(parentElem).find(".lidl-m-pricebox__price").text();
        price = price.substring(1);

        toiletRollObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "toiletroll",
          supermarket: "lidl",
        };
        toiletRollArr.push(toiletRollObj);
      }
    });

    await sender(toiletRollArr).then(() => {
      console.log("Toilet Rolls updated");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getEggsPrice() {
  try {
    const siteUrl = "https://www.lidl.co.uk/our-products/eggs";

    const { data } = await axios({ method: "GET", url: siteUrl });

    const $ = cheerio.load(data);
    let eggsObj = {};
    let eggsArr = [];

    $(".ret-o-card").each((parentIdx, parentElem) => {
      const linkStr = "https://www.lidl.co.uk";
      const siteLink = linkStr + $(parentElem).children("a").attr("href");

      const pictureLink = $(parentElem).find("img").attr("src");

      let description = $(parentElem).find(".ret-o-card__content").text();
      description = description.replace(/\s\s+/g, " ").trim();

      let name = $(parentElem).find(".ret-o-card__headline").text();
      name = name.replace(/\s\s+/g, " ").trim();

      let price = $(parentElem).find(".lidl-m-pricebox__price").text();
      price = price.substring(1);

      eggsObj = {
        name,
        description,
        priceHistory: [
          { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
        ],
        siteLink,
        pictureLink,
        category: "eggs",
        supermarket: "lidl",
      };
      eggsArr.push(eggsObj);
    });

    await sender(eggsArr).then(() => {
      console.log("Eggs updated");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMilkPrice() {
  try {
    const siteUrl = "https://www.lidl.co.uk/c/aberdoyle-dairies/c61";

    const { data } = await axios({ method: "GET", url: siteUrl });

    const $ = cheerio.load(data);
    let milkObj = {};
    let milkArr = [];
    const elemSelector =
      "#pageMain > div > div.nuc-a-wrapper > div > div > div > div > div";

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 2) {
        const linkStr = "https://www.lidl.co.uk";
        const siteLink = linkStr + $(parentElem).find("a").attr("href");

        const pictureLink = $(parentElem).find("img").attr("src");

        let description = $(parentElem).find(".ret-o-card__content").text();
        description = description.replace(/\s\s+/g, " ").trim();

        let name = $(parentElem).find(".ret-o-card__headline").text();
        name = name.replace(/\s\s+/g, " ").trim();
        name = name.substring(0, name.length - 2);

        let price = $(parentElem).find(".lidl-m-pricebox__price").text();
        price = price.substring(1);

        milkObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "milk",
          supermarket: "lidl",
        };
        milkArr.push(milkObj);
      }
    });

    await sender(milkArr).then(() => {
      console.log("Milk updated");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getPastaPrice() {
  try {
    const siteUrl = "https://www.lidl.co.uk/our-products/food-cupboard/dried";

    const { data } = await axios({ method: "GET", url: siteUrl });

    const $ = cheerio.load(data);
    let pastaObj = {};
    let pastaArr = [];
    const elemSelector = ".ret-o-card__link";

    $(elemSelector).each((parentIdx, parentElem) => {
      const linkStr = "https://www.lidl.co.uk";
      if (parentIdx <= 2) {
        const siteLink = linkStr + $(parentElem).attr("href");

        const pictureLink = $(parentElem).find("img").attr("src");
        let description = $(parentElem).find(".ret-o-card__content").text();
        description = description.replace(/\s\s+/g, " ").trim();

        let name = $(parentElem).find(".ret-o-card__headline").text();
        name = name.replace(/\s\s+/g, " ").trim();

        let price = $(parentElem).find(".lidl-m-pricebox__price").text();
        price = price.substring(1);

        pastaObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "pasta",
          supermarket: "lidl",
        };
        pastaArr.push(pastaObj);
      }
    });

    await sender(pastaArr).then(() => {
      console.log("Pasta updated");
    });
  } catch (err) {
    console.log(err);
  }
}

/* async function getBreadPrice() {
  try {
    const siteUrl =
      "https://www.lidl.co.uk/our-products/deluxe/deluxe-breakfast";

    const { data } = await axios({ method: "GET", url: siteUrl });

    const $ = cheerio.load(data);
    let breadObj = {};
    let breadArr = [];

    const elemSelector = ".ret-o-card__link";
    $(elemSelector).each((parentIdx, parentElem) => {
      const linkStr = "https://www.lidl.co.uk";
      if (parentIdx < 1) {
        const siteLink = linkStr + $(parentElem).attr("href");

        const pictureLink = $(parentElem).find("img").attr("src");

        let description = $(parentElem).find(".ret-o-card__content").text();
        description = description.replace(/\s\s+/g, " ").trim();

        let name = $(parentElem).find(".ret-o-card__headline").text();
        name = name.replace(/\s\s+/g, " ").trim();
        name = name.substring(0, name.length - 2);

        let price = $(parentElem).find(".lidl-m-pricebox__price").text();
        price = parseFloat(price.substring(1));

        breadObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "bread",
          supermarket: "lidl",
        };
        breadArr.push(breadObj);
      }
    });

    await sender(breadArr).then(() => {
      console.log("Bread updated");
    });
  } catch (err) {
    console.log(err);
  }
} */

getToiletRollPrice();
getEggsPrice();
getMilkPrice();
getPastaPrice();
//getBreadPrice();
