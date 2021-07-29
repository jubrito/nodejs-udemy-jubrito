
// the data is the product itself, not the products
// ARRAY-DATA: saving data in an array 
// const products = []; // 1. Array-data
const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/path');

const filePath = path.join(
    rootDirectory, 
    'data', 
    'products.json'
);
module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    //  this = object created based on the class
    save() {
        // products.push(this); // 2. Array-data
        fs.readFile(filePath, (error, fileContentJSON) => {
            let products = [];
            if (!error) {
                products = JSON.parse(fileContentJSON); // from json to array
            }
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => { // from array to json
                console.log(error);
            }) 
        });
    }

    static fetchAll(callbackWhenFetchAllIsDone) {
        fs.readFile(filePath, async (error, fileContentJSON) => {
            if (error) {
                callbackWhenFetchAllIsDone([])
            }
            const fileArrayToBePassedThroughCallback = JSON.parse(fileContentJSON);
            callbackWhenFetchAllIsDone(fileArrayToBePassedThroughCallback); // parse returns an array
        })
    }
}