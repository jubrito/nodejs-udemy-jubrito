
// the data is the product itself, not the products
// ARRAY-DATA: if you choose to save data in an array 
// const products = []; // 1. Array-data
const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/path');

const filePath = path.join(
    rootDirectory, 
    'data', 
    'products.json'
);
const getProductsFromFile = callbackWhenFetchAllIsDone => {
    fs.readFile(filePath, (error, fileContentJSON) => {
        if (error) {
            return callbackWhenFetchAllIsDone([]);
        }
        const fileArrayToBePassedThroughCallback = JSON.parse(fileContentJSON);
        callbackWhenFetchAllIsDone(fileArrayToBePassedThroughCallback); // parse returns an array
    })
}
module.exports = class Product {
    constructor(title, imageURL, price, description) {
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
    }

    //  this = object created based on the class
    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => { // passing the callback function while writing the code that actually saves 
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => { // from array to json
                console.log(error);
            })
        });
        // products.push(this); // 2. Array-data
    }

    static fetchAll(callbackWhenFetchAllIsDone) {
       getProductsFromFile(callbackWhenFetchAllIsDone);
    }
}