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

  static handleUpdateCartItem(newQuantity, updatedCartItems, cartProductIndex) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1; 
    updatedCartItems[cartProductIndex].quantity = newQuantity; 
  }

  addToCart(product) { 
    const cartProductIndex = this.cart != null ? this.cart.items.findIndex((cartProduct) => cartProduct.productId.toString() === product._id.toString()) : -1; 
    const updatedCartItems = this.cart != null ? [...this.cart.items] : []; 
    let newQuantity = 1; 
    if (cartProductIndex >= 0) { 
      handleUpdateCartItem(newQuantity, updatedCartItems, cartProductIndex);
    } else { 
      updatedCartItems.push({ 
        productId: new ObjectId(product._id), 
        quantity: newQuantity
      }); 
    } 
    const updatedProduct = { items: updatedCartItems }; 
    const db = getDb(); 
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) }, 
      { $set: { cart: updatedProduct } }); 
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(cartItem => {
      return cartItem.productId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(cartProducts => {
        return cartProducts.map(cartProduct => {
          return {
            ...cartProduct,
            quantity: this.cart.items.find(item => {
              return item.productId.toString() === cartProduct._id.toString();
            }).quantity
          };
        })
      })
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(cartItem => {
      return cartItem.productId.toString() !== productId.toString(); // return true if I want to keep and false if you want to get rid of it
    })
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id)},
        { $set: { cart: { items: updatedCartItems } }}
      );
  }

  // TODO: add or remove items one by one from cart
  // removeOneFromCart(product) {
  //   const cartProductIndex = this.cart != null ? this.cart.items.findIndex((cartProduct) => cartProduct.productId.toString() === product._id.toString()) : -1;
  //   const updatedCartItems = this.cart != null ? [...this.cart.items] : [];
  //   let currentQuantity = this.cart.items[cartProductIndex].quantity;
  //   let newQuantity = 0;
  //   console.log('cartProductIndex',cartProductIndex)
  //   if (cartProductIndex < 0) {
  //     return;
  //   }
  //   if (currentQuantity > 1) {
  //     newQuantity = this.cart.items[cartProductIndex].quantity - 1; 
  //     updatedCartItems[cartProductIndex].quantity = newQuantity; 
  //   } else {
  //     updatedCartItems = updatedCartItems.splice(cartProductIndex, 1);
  //   }
  //   const updatedProduct = { items: updatedCartItems };
  //   const db = getDb();
  //   return db.collection("users").updateOne(
  //     { _id: new ObjectId(this._id)},
  //     { $set: { cart: updatedProduct }}
  //   )
  // }

  addOrder() {
    const db = getDb();
    return this.getCart().then(cartProducts => {
      const order = {
        items: cartProducts,
        user: {
          _id: new ObjectId(this._id),
          username: this.username,
        }
      }
      return db
      .collection('orders')
      .insertOne(order)
    })
    .then(result => {
      this.cart = {items: []};
      return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id)},
        { $set: { cart: { items: [] } }}
      );
    })
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({'user._id': new ObjectId(this._id)})
      .toArray();
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
