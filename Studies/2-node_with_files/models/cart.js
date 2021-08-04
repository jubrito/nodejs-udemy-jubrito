const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/rootDirectory');

const filePath = path.join(
    rootDirectory,
    'data',
    'cart.json'
)

function updateProductAndCartQuantity(existingProduct, existingProductIndex, updatedProduct, cart) {
    updatedProduct = { ...existingProduct};
    updatedProduct.quantity = updatedProduct.quantity + 1;
    cart.products = [...cart.products];
    cart.products[existingProductIndex] = updatedProduct;
}
function addNewProductToTheCart(id, cart){
    let updatedProduct = { id: id, quantity: 1};
    cart.products = [...cart.products, updatedProduct];
}
function checkIfProjectAlreadyExistsOnCart (id, cart){
    const existingProductIndex = cart.products.findIndex(
        product => product.id === id
    );
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;
    if (existingProduct) {
        updateProductAndCartQuantity(
            existingProduct, 
            existingProductIndex, 
            updatedProduct, 
            cart);
    } else {
        addNewProductToTheCart(id, cart);
    }
}

module.exports = class Cart {
    static addProduct(id, newProductPrice) {
        fs.readFile(filePath, (error, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!error) { // error = false => got an existing cart
                cart = JSON.parse(fileContent);
            }
            checkIfProjectAlreadyExistsOnCart(id, cart);
            
            cart.totalPrice = cart.totalPrice + +newProductPrice; // +newProductPrice is the same as Number(newProductPrice)
            fs.writeFile(filePath, JSON.stringify(cart), (error) => {
                console.log(error);
            })
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(filePath, (error, fileContent) => {
            console.log(error);
            if (error) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(product => product.id === id);
            if (!product) {
                return;
            }
            const productQuantity = product.quantity;
            updatedCart.products = updatedCart.products.filter(product => product.id !== id); 
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;

            fs.writeFile(filePath, JSON.stringify(updatedCart), error => {
                console.log(error);
            })
        });
    }

    static getCart(callbackWhenReadFileIsDone) {
        fs.readFile(filePath, (error, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (error) {
                callbackWhenReadFileIsDone(none);
            } else {
                callbackWhenReadFileIsDone(cart);
            }
        })
    }
}