const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData){
                    cartProducts.push({ productData: product, quantity: cartProductData.quantity });
                }
            }
            console.log(cartProducts);
            res.render('shop/cart', {
                pageTitle: 'Your cart',
                products: cartProducts,
                path: '/cart'
            });
        })
    })
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        console.log('product postCart');
        console.log(product);
        Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
}
exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        console.log('product postCartDeleteItem');
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    })
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