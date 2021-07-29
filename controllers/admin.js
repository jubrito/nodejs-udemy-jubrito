const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    resp.render('admin/add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, resp, next) => {
    // const {title, imageURL, price, description} = req.body;
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageURL, price, description);
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