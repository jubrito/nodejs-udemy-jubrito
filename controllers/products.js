const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    /* Loading EJS files - Template Engines */
    resp.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, resp, next) => {
    const product = new Product(req.body.title);
    product.save();
    resp.redirect('/');
};

exports.getProducts = (req, resp, next) => {
    const products = Product.fetchAll((products) => {
        resp.render('shop/product-list', { 
            products: products, 
            pageTitle: 'Shop', 
            path: '/', 
        }); 
    });
}