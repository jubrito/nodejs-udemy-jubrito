
// the data is the product itself, not the products
// ARRAY-DATA: if you choose to save data in an array 
// const products = []; // 1. Array-data
const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/rootDirectory');

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
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    // updateExistingProduct(products, thisProductAlreadyExists);
    // function updateExistingProduct(products, productExistingId) {
    //     const existingProductIndex = products.findIndex(product => product.id == productExistingId);
    //     const updatedProducts = [...products];
    //     updatedProducts[existingProductIndex] = this; // this = the object when instantiating the new Product, i.e the updated product
    //     fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => { 
    //         console.log(error);
    //     })
    // }
    //  this = object created based on the class
    save() {
        getProductsFromFile(products => { // passing the callback function while writing the code that actually saves 
            const thisProductAlreadyExists = this.id;
            if (thisProductAlreadyExists) { 
                    // updateExistingProduct(products, thisProductAlreadyExists);
                const existingProductIndex = products.findIndex(product => product.id == this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this; // this = the object when instantiating the new Product, i.e the updated product
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => { 
                    console.log(error);
                })
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (error) => { // stringfy from array to json
                    console.log(error);
                })
            }
        });
        // products.push(this); // 2. Array-data
    }

    static fetchAll(callbackWhenFetchAllIsDone) {
       getProductsFromFile(callbackWhenFetchAllIsDone);
    }

    static findById(id, callbackWhenFetchAllIsDone) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            callbackWhenFetchAllIsDone(product);
        })
    }
}