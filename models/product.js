
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
    constructor(title, price, description, imageUrl, _id){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = _id;
    }


    save() {
        const db = getDb();
        let databaseOperation;
        const theProductAlreadyExists = this._id;
        const filterWhichDocumentWillBeUpdated = {_id: new mongodb.ObjectId(this._id)};
        // howTheDocumentWillBeUpdated could be { $set: { title: this.title, etc }}
        const howTheDocumentWillBeUpdated = { $set: this }; 
        if (theProductAlreadyExists) {
            databaseOperation = db.collection('products')
                .updateOne(
                    filterWhichDocumentWillBeUpdated,
                    howTheDocumentWillBeUpdated
                )
        } else {
            // this = the object instanciated representing { name: 'Book', price:...} 
            databaseOperation =  db.collection('products').insertOne(this);
        }
        return databaseOperation
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