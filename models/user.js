const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, _id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this);
  }

  // TODO static updateExistingProduct() {}
  addToCart(product) { 
    const cartProductIndex = this.cart != null ? this.cart.items.findIndex((cartProduct) => cartProduct.productId.toString() === product._id.toString()) : -1; 
    const updateCartItems = this.cart != null ? [...this.cart.items] : []; 
    let newQuantity = 1; 
    if (cartProductIndex >= 0) { 
      newQuantity = this.cart.items[cartProductIndex].quantity + 1; 
      updateCartItems[cartProductIndex].quantity = newQuantity; 
    } else { 
      updateCartItems.push({ 
        productId: new ObjectId(product._id), 
        quantity: newQuantity
      }); 
    } 
    const updateProduct = { items: updateCartItems }; 
    const db = getDb(); 
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) }, 
      { $set: { cart: updateProduct } }); 
  }

  getCart() {
    const db = getDb();
    const productIds = this.getCart.items.map(cartItem => {
      return cartItem.productId;
    });
    return db.collection('products')
      .findById({ _id: { $in: [productIds] } })
      .toArray()
      .then(cartProducts => {
        return cartProducts.map(product => {
          return {
            ...product,
            quantity: this.cartItem.items.findById(item => {
              return item.productId.toString() === product._id.toString();
            }).quantity
          };
        })
      })
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
