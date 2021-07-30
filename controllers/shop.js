const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}
exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your cart',
        path: '/cart'
    });
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
    console.log(productId);
}
exports.getOrders= (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
    })
}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}