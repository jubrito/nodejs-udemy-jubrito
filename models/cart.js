const fs = require('fs');
const path = require('path');
const rootDirectory = require('../util/rootDirectory');

const filePath = path.dirname(
    rootDirectory,
    'data',
    'cart.json'
)

function updateProductAndCartQuantityIfItAlreadyExistsOnCart (cart){
  
}

module.exports = class Cart {
    static addProduct(id, newProductPrice) {
        fs.readFile(filePath, (error, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!error) { // error = false => got an existing cart
                cart = JSON.parse(fileContent);
            }
            // updateProductAndCartQuantityIfItAlreadyExistsOnCart(cart);
            const existingProductIndex = cart.products.findIndex(
                product => product.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProductIndex) {
                updatedProduct = { ...existingProduct};
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;

            } else {
                updatedProduct = { id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + newProductPrice;
            console.log(cart);
            fs.writeFile(filePath, JSON.stringify(cart), (error) => {
                console.log(error);
            })
        })
    }

}