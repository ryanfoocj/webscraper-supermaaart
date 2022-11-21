const express = require('express')
const { Builder, By } = require('selenium-webdriver');
const moment = require("moment");
const sender = require('./sender');

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
        while(count < 6){
        for (const element of elements) {
            //these elements can only be retrieved with product numbers
            const prodNumbers = {"Tesco Medium Free Range Eggs 6 Pack": 250802613, "Big & Fresh Mixed Sized Eggs 6 Pack": 253270171, "Tesco 15 Eggs": 299626009, "Tesco Large Free Range Eggs 6 Pack": 250802567, "Tesco Free Range Eggs Very Large 6 Pack": 252781973}
            const prodImg = {250802613: 'https://digitalcontent.api.tesco.com/v2/media/ghs/b4147169-aef2-4677-98a3-d31736379066/ee02524e-e3a5-408d-8172-b7d9cccb6b5a.jpeg?h=540&w=540', 253270171: 'https://digitalcontent.api.tesco.com/v2/media/ghs/2eb968eb-b8ba-4e83-807c-9045a458e1e0/361ba900-c538-4f11-b808-ed10a1548ddd.jpeg?h=540&w=540', 299626009: 'https://digitalcontent.api.tesco.com/v2/media/ghs/df176611-9b0d-4489-b9ac-fa20964dd858/b80df98c-6159-4be1-9f43-d67341e0cb52.jpeg?h=540&w=540' , 250802567: 'https://digitalcontent.api.tesco.com/v2/media/ghs/533fe07f-de38-4064-adbb-2761705870f0/f49b79da-20ca-41a5-8556-1a44725797f6.jpeg?h=540&w=540', 252781973: 'https://digitalcontent.api.tesco.com/v2/media/ghs/2c49507a-2e47-431a-b88a-006b06166a1b/ed8aee54-94ba-4ec9-9e32-6533e3d299dd.jpeg?h=540&w=540'}
            const ProdDesc = {250802613: "Medium Class A Free Range Eggs.", 253270171: "Eggs of different sizes.", 299626009: "Class A eggs from caged hens.", 250802567: "6 Large class A free range eggs.", 252781973: "6 Very large class A free range eggs."}
            const data = await element.findElement(By.css(`li.product-list--list-item:nth-child(${count}) > div > div`)).getText();

            const dataBlocks = data.split(`\n`)
            //cutting elements that alter output parity
            if(dataBlocks.indexOf('Write a review')){
                const review = dataBlocks.indexOf('Write a review');
                if (review > -1){
                    dataBlocks.splice(review, 1)
                }
            }
            if(dataBlocks.indexOf('Aldi Price Match')){
                const aldiPriceMatch = dataBlocks.indexOf('Aldi Price Match');
                if (aldiPriceMatch > -1){
                    dataBlocks.splice(aldiPriceMatch, 1)
                }
            }
            if(dataBlocks.indexOf('This product is available for deliveries from 1pm')){
                const delivery = dataBlocks.indexOf('This product is available for deliveries from 1pm');
                if (delivery > -1){
                    dataBlocks.splice(delivery, 1)
                }
            }
            if(dataBlocks.indexOf('Low Everyday Price')){
                const delivery = dataBlocks.indexOf('Low Everyday Price');
                if (delivery > -1){
                    dataBlocks.splice(delivery, 1)
                }
            }
            if(dataBlocks.indexOf("Clubcard Price")){
                const delivery = dataBlocks.indexOf("Clubcard Price");
                if (delivery > -1){
                    dataBlocks.splice(delivery, 1)
                }
            }
            const notStocked = dataBlocks.indexOf("This product's currently out of stock");
            if(notStocked > -1){
                dataBlocks[4] = "currently out of stock"
            }

            const name = dataBlocks[0];
            const id = prodNumbers[name];
            const price = dataBlocks[4];
            
            const description = ProdDesc[id];
            const siteLink = `https://www.tesco.com/groceries/en-GB/products/${id}}`;
            const pictureLink = prodImg[id];

            elementDetails.push({
                name: name ?? '',
                description: description ??'',
                priceHistory: [
                    { updateDate: moment().format("MMM Do[|]hh:mma"), price: price }, ],
                price: price ??'',
                siteLink: siteLink ?? '',
                pictureLink: pictureLink ?? '',
                category: "eggs",
                supermarket: "tesco"
            });  
        }
        count ++;
    }
    }catch (error) {
    console.log(error);
    }
    return elementDetails;
} 

/*
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
*/

async function WebScrapingLocalTestEggs() {
    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get("https://www.tesco.com/groceries/en-GB/shop/fresh-food/milk-butter-and-eggs/eggs?sortBy=price-ascending")

        const allElements = await driver.findElements(
            By.css(".product-list")
        );

        return await getElements(allElements).then((elementDetails) => sender(elementDetails));
    } catch (error) {
        throw new Error (error);
    } finally {
        await driver.quit();
    }
}

setTimeout(WebScrapingLocalTestEggs, 15000);
console.log("Eggs updated (Tesco)")