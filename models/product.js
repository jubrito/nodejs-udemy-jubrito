
// the data is the product itself, not the products
const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/rootDirectory');
const Cart = require('./cart');

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
const updateExistingProduct = (products, productExistingId, updatedProduct) => {
    const existingProductIndex = products.findIndex(product => product.id == productExistingId);
    const updatedProducts = [...products];
    updatedProducts[existingProductIndex] = updatedProduct; 
    fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => { 
        console.log(error);
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
    //  this = object created based on the class
    save() {
        getProductsFromFile(products => { // passing the callback function while writing the code that actually saves 
            const thisProductAlreadyExists = this.id;
            if (thisProductAlreadyExists) { 
                updateExistingProduct(products, thisProductAlreadyExists, this); // = this = the object when instantiating the new Product, i.e the updated product
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (error) => { // stringfy from array to json
                    console.log(error);
                })
            }
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            console.log(product);
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
                if (!error) {
                    Cart.deleteProduct(id, product.price);
                    console.log(error);
                }
            });
        });
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