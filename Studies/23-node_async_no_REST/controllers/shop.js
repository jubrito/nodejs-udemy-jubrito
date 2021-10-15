const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require("stripe")(process.env.STRIPE_KEY);
const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalNumberOfProducts;
    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalNumberOfProducts = numberOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalNumberOfProducts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalNumberOfProducts / ITEMS_PER_PAGE) // ceil rounds up
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

exports.getCheckout = (req, res, next) => {
    let total = 0;
    let productsArrayPopulatedWithDetailedData;
    req.user.populate('cart.items.productId').then(user => {
        productsArrayPopulatedWithDetailedData = user.cart.items; // array with fields quantity and product id (detailed with product information thanks to populate)
        productsArrayPopulatedWithDetailedData.forEach(product => {
            total += product.quantity * product.productId.price
        })
        return stripe.checkout.sessions.create({
            payment_method_types: ['card'], // accept credit card payments
            line_items: productsArrayPopulatedWithDetailedData.map((product) => {
              return {
                name: product.productId.title,
                description: product.productId.description,
                amount: product.productId.price * 100,
                currency: 'usd',
                quantity: product.quantity,
              };
            }),
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success', //http://localhost:3000/checkout/success
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
          });
    })
    .then(session => {
        res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            products: productsArrayPopulatedWithDetailedData,
            totalSum: total,
            sessionId: session.id
        })
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getCheckoutSuccess = (req, res, next) => {
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

function storesPDFOnTheServerAndSendItToTheUser(newPDFDocument, invoicePath, res) {
    newPDFDocument.pipe(fs.createWriteStream(invoicePath));
    newPDFDocument.pipe(res);
}
function writesOnPDF(newPDFDocument, order) {
    newPDFDocument.fontSize(26).text('Invoice', {
        underline: true
    });
    newPDFDocument.text('-------------------------------');
    let totalPrice = 0;
    order.products.forEach(productOrdered => {
        totalPrice += productOrdered.quantity * productOrdered.product.price
        newPDFDocument
            .fontSize(14)
            .text(
                productOrdered.product.title + ' - ' + 
                productOrdered.quantity + ' x ' + '$' + 
                productOrdered.product.price
            );
    })
    newPDFDocument.text('-');
    newPDFDocument.fontSize(20).text('Total Price: $' + totalPrice);
}
function createAndReadInvoiceToAuthenticatedUser(orderId, res, order) {
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const newPDFDocument = new PDFDocument();
    res.setHeader(
        // open the pdf on browser instead of downloading it
       'Content-Type', 'application/pdf'
    );
    res.setHeader(
        // how the content should be served to the client (inline = on the browser)
        'Content-Disposition',
        'inline; filename="' + invoiceName +'"'
    )

    storesPDFOnTheServerAndSendItToTheUser(newPDFDocument, invoicePath, res);
    writesOnPDF(newPDFDocument, order);
    newPDFDocument.end();
}
function readExistingPdfInvoiceBelongedToTheUser(orderId, res) {
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
        // readExistingPdfInvoiceBelongedToTheUser(orderId, res);
        createAndReadInvoiceToAuthenticatedUser(orderId, res, order);
    })
}