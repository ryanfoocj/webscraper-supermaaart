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
        supermarket: "lidl",
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
      price = parseFloat(price.substring(1));

      eggsObj = {
        name,
        description,
        price,
        siteLink,
        pictureLink,
        category: "eggs",
        supermarket: "lidl",
      };
      eggsArr.push(eggsObj);
    });
    fs.readFile("./data/eggs.json").then((data) => {
      const parsedData = JSON.parse(data);
      eggsArr.forEach((item) => {
        parsedData.push(item);
      });
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("./data/eggs.json", returnData, "utf-8").catch((err) => {
        console.log("Could not write");
      });
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
        price = parseFloat(price.substring(1));

        milkObj = {
          name,
          description,
          price,
          siteLink,
          pictureLink,
          category: "milk",
          supermarket: "lidl",
        };
        milkArr.push(milkObj);
      }
    });
    fs.readFile("./data/milk.json").then((data) => {
      const parsedData = JSON.parse(data);
      milkArr.forEach((item) => {
        parsedData.push(item);
      });
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("./data/milk.json", returnData, "utf-8").catch((err) => {
        console.log("Could not write");
      });
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
        price = parseFloat(price.substring(1));

        pastaObj = {
          name,
          description,
          price,
          siteLink,
          pictureLink,
          category: "pasta",
          supermarket: "lidl",
        };
        pastaArr.push(pastaObj);
      }
    });
    fs.readFile("./data/pasta.json").then((data) => {
      const parsedData = JSON.parse(data);
      pastaArr.forEach((item) => {
        parsedData.push(item);
      });
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("./data/pasta.json", returnData, "utf-8").catch((err) => {
        console.log("Could not write");
      });
    });
  } catch (err) {
    console.log(err);
  }
}

async function getBreadPrice() {
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

        console.log(description, name, price);

        breadObj = {
          name,
          description,
          price,
          siteLink,
          pictureLink,
          category: "bread",
          supermarket: "lidl",
        };
        breadArr.push(breadObj);
      }
    });
    fs.readFile("./data/bread.json").then((data) => {
      const parsedData = JSON.parse(data);
      breadArr.forEach((item) => {
        parsedData.push(item);
      });
      const returnData = JSON.stringify(parsedData);

      fs.writeFile("./data/bread.json", returnData, "utf-8").catch((err) => {
        console.log("Could not write");
      });
    });
  } catch (err) {
    console.log(err);
  }
}

getBreadPrice();
