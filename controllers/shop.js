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

function readInvoiceBelongedToTheUser(orderId, res) {
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const file = fs.createReadStream(invoicePath); // read in the file step by step in different chunks
    res.setHeader(
         // open the pdf on browser instead of downloading it
        'Content-Type', 'application/pdf'
    );
    res.setHeader(
        // how the content should be served to the client (inline = on the browser)
        'Content-Disposition', 
        'inline; filename="' + invoiceName +'"'
    )
    file.pipe(res); // response will be streamed to the browser that will be streamed to the client on the fly
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order => {
        if (!order) {
            return next(new Error('No order found'))
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'));
        }
        readInvoiceBelongedToTheUser(orderId, res);
    })
}