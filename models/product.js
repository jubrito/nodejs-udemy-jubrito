
const Cart = require('./cart');
const database = require('../util/database');

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

    save() {
        
    }

    static delete(id) {
        
    }

    static fetchAll() {
       return database.execute('SELECT * FROM products'); // returns the entire promisse to handle the then catch where we call fetchAll()
    }

    static findById(id) {
        
    }
}