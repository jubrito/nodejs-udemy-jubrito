const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(error => {
        console.log(error)
    });
}
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId') //fetch data for a path (cart.items.productId)
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                products: products
            })
        })
        .catch(err => console.log(err));
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    
}

exports.postCreateOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(cartItems => {
                // to match the order model
                return {
                    quantity: cartItems.quantity, 
                    product: {...cartItems.productId._doc}
                }
            });
            const order = new Order({
                user: {
                    username: req.user.name,
                    userId: req.user,
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
    
}

exports.getOrders = (req, res, next) => {
    Order
        .find({"user.userId": req.user._id})
        .then(orders => {
            console.log(orders)
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            })
        })
        .catch(err => console.log(err));
}