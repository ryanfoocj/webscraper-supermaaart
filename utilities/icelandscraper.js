const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs/promises");
const moment = require("moment");
const sender = require("./sender");

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
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "bread",
          supermarket: "iceland",
        };
        breadArr.push(breadObj);
      }
    });
    await sender(breadArr).then(() => {
      console.log("Bread updated (Iceland)");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getToiletRollPrice() {
  try {
    const siteUrl =
      "https://www.iceland.co.uk/household/toilet-roll-kitchen-roll-and-tissues?pmin=0.01&prefn1=filterType&prefv1=Toilet%20Roll&srule=price-low-to-high&start=0&sz=25";

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector = "#primary > div.search-result-content > ul > li";
    let toiletRollObj = {};
    let toiletRollArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 4) {
        const siteLink = $(parentElem).find(".thumb-link").attr("href");
        const pictureLink = $(parentElem).find("img").attr("data-src");
        const name = $(parentElem).find(".name-link").children("span").text();
        let price = $(parentElem)
          .find(".product-sales-price")
          .children("span")
          .text();
        price = price.substring(1);

        const description = "";
        toiletRollObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "toiletroll",
          supermarket: "iceland",
        };
        toiletRollArr.push(toiletRollObj);
      }
    });
    await sender(toiletRollArr).then(() => {
      console.log("ToiletRoll updated (Iceland)");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getPastaPrice() {
  try {
    const siteUrl =
      "https://www.iceland.co.uk/food-cupboard/rice-pasta-and-noodles/pasta?srule=Margin-best-sellers&pmin=1.01&pmax=2.00";
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector = "#primary > div.search-result-content > ul > li";
    let pastaObj = {};
    let pastaArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 4) {
        const siteLink = $(parentElem).find(".thumb-link").attr("href");
        const pictureLink = $(parentElem).find("img").attr("data-src");
        const name = $(parentElem).find(".name-link").children("span").text();
        let price = $(parentElem)
          .find(".product-sales-price")
          .children("span")
          .text();
        price = price.substring(1);

        const description = "";
        pastaObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "pasta",
          supermarket: "iceland",
        };
        pastaArr.push(pastaObj);
      }
    });
    await sender(pastaArr).then(() => {
      console.log("Pasta updated (Iceland)");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getEggsPrice() {
  try {
    const siteUrl = "https://www.iceland.co.uk/fresh/milk-butter-and-eggs/eggs";
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector = "#primary > div.search-result-content > ul > li";
    let eggsObj = {};
    let eggsArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx <= 4) {
        const siteLink = $(parentElem).find(".thumb-link").attr("href");
        const pictureLink = $(parentElem).find("img").attr("data-src");
        const name = $(parentElem).find(".name-link").children("span").text();
        let price = $(parentElem)
          .find(".product-sales-price")
          .children("span")
          .text();
        price = price.substring(1);

        const description = "";
        eggsObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "eggs",
          supermarket: "iceland",
        };
        eggsArr.push(eggsObj);
      }
    });
    await sender(eggsArr).then(() => {
      console.log("Eggs updated (Iceland)");
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMilkPrice() {
  try {
    const siteUrl =
      "https://www.iceland.co.uk/fresh/milk-butter-and-eggs/milk?srule=price-low-to-high&start=0&sz=25";
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector = "#primary > div.search-result-content > ul > li";
    let milkObj = {};
    let milkArr = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentIdx > 1 && parentIdx <= 6) {
        const siteLink = $(parentElem).find(".thumb-link").attr("href");
        const pictureLink = $(parentElem).find("img").attr("data-src");
        const name = $(parentElem).find(".name-link").children("span").text();

        let price = $(parentElem)
          .find(".product-sales-price")
          .children("span")
          .text();
        price = price.substring(1);

        const description = "";
        milkObj = {
          name,
          description,
          priceHistory: [
            { updateDate: moment().format("MMM Do[|]hh:mma"), price: price },
          ],
          siteLink,
          pictureLink,
          category: "milk",
          supermarket: "iceland",
        };
        milkArr.push(milkObj);
      }
    });

    await sender(milkArr).then(() => {
      console.log("Milk updated (Iceland)");
    });
  } catch (err) {
    console.log(err);
  }
}

getBreadPrice();
getEggsPrice();
getMilkPrice();
getPastaPrice();
getToiletRollPrice();
