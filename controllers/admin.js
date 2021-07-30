const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    resp.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, resp, next) => {
    // const {title, imageUrl, price, description} = req.body;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
    product.save();
    resp.redirect('/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Product List',
            path: '/admin/products'
        });
    });
};