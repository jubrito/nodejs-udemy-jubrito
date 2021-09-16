const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: { // Embedded Document
        items: [{
            productId: { 
                type: Schema.Types.ObjectId, ref: 'Product', required: true
            }, 
            quantity: { 
                type: Number, required: true
            }
        }],
    },
    orders: [
        {
            items: [{
                productId: { 
                    type: Schema.Types.ObjectId, ref: 'Product', required: true
                }, 
                quantity: { 
                    type: Number, required: true
                }
            }]
        }
    ]
});

UserSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart != null ? this.cart.items.findIndex((cartProduct) => cartProduct.productId.toString() === product._id.toString()) : -1; 
    const updatedCartItems = this.cart != null ? [...this.cart.items] : []; 
    const theProductExistsInTheCart = cartProductIndex >= 0;
    let newQuantity = 1; 

    if (theProductExistsInTheCart) { 
        newQuantity = this.cart.items[cartProductIndex].quantity + 1; 
        updatedCartItems[cartProductIndex].quantity = newQuantity; 
    } else { 
      updatedCartItems.push({ 
        productId: product._id, 
        quantity: newQuantity
      }); 
    } 
    const updatedCart = { 
        items: updatedCartItems 
    }; 
    this.cart = updatedCart;
    return this.save();
}

UserSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

UserSchema.methods.clearCart = function(){
    this.cart = { items: [] };
    return this.save();
}

UserSchema.methods.createOrder = function() {
    const cart = this.cart;
    if (!cart) {
        return;
    }
    this.orders.push(cart);
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', UserSchema);