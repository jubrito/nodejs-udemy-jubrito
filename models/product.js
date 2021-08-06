
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
    constructor(title, price, description, imageUrl){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }


    save() {
        const db = getDb();
        // this = the object instanciated representing { name: 'Book', price:...} 
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {console.log(err)}); 
    }

    static fetchAll() {
        const db = getDb();
        // .toArray() Cursor: get all documents and turn them into a javascript array
        return db.collection('products')
            .find()
            .toArray()
            .then(products =>{
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(productId) {
        // finding the id taking in consideration mongo stored it as bson
        const db = getDb();
        return db.collection('products')
            .find({ _id: mongodb.ObjectId(productId) })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;