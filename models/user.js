const { getDb } = require("../util/database");
const mongodb = require('mongodb');
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db
            .collections('users')
            .insertOne(this)
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: mongodb.ObjectId(userId) }) 
        .then(user => {
            console.log(user);
            console.log('user created')
        })
        .catch(err => console.log(err));
    }
}

module.exports= User;