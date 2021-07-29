const Product = require('../models/product');

exports.getProducts = (req, resp, next) => {
    const products = Product.fetchAll((products) => {
        resp.render('shop/product-list', { 
            products: products, 
            pageTitle: 'All products', 
            path: '/products', 
        }); 
    });
}

