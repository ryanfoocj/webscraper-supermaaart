const express = require('express')
const { Builder, By } = require('selenium-webdriver');
const moment = require("moment");

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

async function getElements(elements) {
    let count = 1;
    let elementDetails = [];
    try {
        while(count < 6){
        for (const element of elements) {
            //these elements can only be retrieved with product numbers
            const prodNumbers = {"H W Nevill's White Bread 800G": 299045570, "Tesco White Bread 800G": 299389116, "Tesco Toastie White Bread Thick 800G": 299425748, "Tesco White Crusty Cob": 305961904, "Crusty White Bloomer Sliced 400G": 258397693}
            const prodImg = {299045570: 'https://digitalcontent.api.tesco.com/v2/media/ghs/719aef95-1185-49ce-a510-e83d216b50f8/64231253-1022-4472-bfa4-4ede5f9b1fd9.jpeg?h=540&w=540', 299389116: 'https://digitalcontent.api.tesco.com/v2/media/ghs/e80688e5-6eda-4de5-97b5-4a751751109b/d5d753df-5f3b-46d1-ac50-3f2a6dec3fcf.jpeg?h=540&w=540', 299425748: 'https://digitalcontent.api.tesco.com/v2/media/ghs/57190e4b-68e6-48cc-9f49-18c5c4166d68/584bffe6-3613-427d-9f34-5df17198ba6b.jpeg?h=540&w=540' , 305961904: 'https://digitalcontent.api.tesco.com/v2/media/ghs/5ee84b69-7482-42e8-9482-66b7b40d3d34/fc41462f-e6a8-4b19-ba3f-a116ac88c813.jpeg?h=540&w=540', 258397693: 'https://digitalcontent.api.tesco.com/v2/media/ghs/f4cc3065-afbc-4cf0-8477-57e05a45f335/eca9a625-7457-49db-9b09-536840647de0.jpeg?h=540&w=540'}
            const prodDesc = {299045570: 'Medium sliced white bread.', 299389116: 'Medium sliced white bread.', 299425748:  'Thick sliced white bread.', 305961904: ' baked for a golden crust and soft, fluffy inside.', 258397693: 'Sliced White Bloomer baked for a golden crust and soft, fluffy inside. Sliced in store.'}
            
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
            const description = prodDesc[id];
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
                category: "bread",
                shop: "tesco"
            });  
        }
        count ++;
    }
    }catch (error) {
    console.log(error);
    }
    return elementDetails;
} 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

async function WebScrapingLocalTest() {
    try {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get("https://www.tesco.com/groceries/en-GB/shop/bakery/bread-and-rolls/white-bread?sortBy=price-ascending")

        const allElements = await driver.findElements(
            By.css(".product-list")
        );

        return await getElements(allElements);
        console.log(getElements(allElements))
    } catch (error) {
        throw new Error (error);
    } finally {
        await driver.quit();
    }
}
