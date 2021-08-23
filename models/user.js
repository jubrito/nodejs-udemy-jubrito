const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, _id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = this._id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this);
  }

  addToCart(product) {
    const cartProducts = this.cart.items.fndIndex(cartProduct => {
      return cartProduct._id = product._id
    });
    const updatedCart = {items: [{...product, quantity: 1}]};
    const db = getDb();
    db.collection('users').updateOne(
      {_id: new ObjectId(this._id)}, 
      {$set: {cart: updatedCart}}
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
