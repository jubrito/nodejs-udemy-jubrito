
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
        /*  Extra Security Layer
                To safely insert values and not face the issue of SQL injection which is an attack pattern 
            where users can insert special data into your input fields in your webpage that runs as SQL queries.
                When we use  "?" as values and passing them as the second argument MySQL will safely escape the input 
            values to basically parse it for hidden SQL commands and remove them */
        return database.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static delete(id) {
        
    }

    static fetchAll() {
       return database.execute('SELECT * FROM products'); // returns the entire promisse to handle the then catch where we call fetchAll()
    }

    static findById(id) {
        return database.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}