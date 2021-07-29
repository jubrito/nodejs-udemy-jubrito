const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    /* Loading EJS files - Template Engines */
    resp.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, resp, next) => {
    const {title, imageURL, price, description} = req.body;
    const product = new Product(title, imageURL, price, description);
    product.save();
    resp.redirect('/products');
};

exports.getAdminProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Product List',
            path: '/admin/products'
        });
    });
}