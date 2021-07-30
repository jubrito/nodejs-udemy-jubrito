const Product = require('../models/product');

exports.getProducts = (req, resp, next) => {
    Product.fetchAll((products) => {
        resp.render('shop/product-list', { 
            products: products, 
            pageTitle: 'All products', 
            path: '/products', 
        }); 
    });
}

exports.getProductById = (req, res, next) => {
    const productID = req.params.productID;
    console.log(productID);
}
