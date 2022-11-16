const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

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

    $(elemSelector).each((parentIdx, parentElem) => {
      const linkStr = "https://www.lidl.co.uk/";
      const siteLink = linkStr + $(parentElem).children("a").attr("href");

      const pictureLink = $(parentElem).find("img").attr("src");
      let name = $(parentElem).find("h3").text();
      name = name.replace(/\s\s+/g, " ").trim();

      let description = $(parentElem).find(".ret-o-card__content").text();
      description = description.replace(/\s\s+/g, " ").trim();

      let price = $(parentElem).find(".lidl-m-pricebox__price").text();
      itemObj = {
        name,
        description,
        price,
        siteLink,
        pictureLink,
        category: "toiletroll",
      };
      console.log(itemObj);
    });
  } catch (err) {
    console.log(err);
  }
}

async function getBreadPrice() {}

getToiletRollPrice();
