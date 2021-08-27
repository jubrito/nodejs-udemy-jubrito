const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
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
    .getCart()
    .then(products => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Cart',
            products: products
        })
    })
    .catch(err => console.log(err))
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
        .deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    
}

exports.postCreateOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {console.log(err)})
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            })
        })
        .catch(err => console.log(err));
}

// TODO: add or remove items one by one from cart
// exports.postCartDeleteOneItem = (req, res, next) => {
//     const productId = req.body.productId;
//     Product.findById(productId)
//         .then(product => {
//             return req.user.removeFromCart(product);
//         })
//         .then(result => {
//             res.redirect('/cart');
//             console.log(result);
//         })
//         .catch(err => console.log(err));
    
// }
