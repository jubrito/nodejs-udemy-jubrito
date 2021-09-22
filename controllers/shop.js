const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        console.log(err);
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
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
                products: products,
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
    
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
                    email: req.user.email,
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
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
    
}

exports.getOrders = (req, res, next) => {
    Order
        .find({"user.userId": req.user})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    fs.readFile(invoicePath, (err, fileDataAsBuffer) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        res.send(fileDataAsBuffer);
    })
}