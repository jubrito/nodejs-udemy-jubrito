const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    resp.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editIsEnabled: false,
    });
};

exports.postAddProduct = (req, resp, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description);
    product.save()
        .then(() => {
            resp.redirect('/admin/products');
        })
        .catch();
};

exports.getEditProduct = (req, res, next) => {
    const editIsEnabled = req.query.edit;
    const productId = req.params.productId;
    if (!editIsEnabled) {
        return res.redirect('/');
    }
    Product.findById(productId, product => {
        if (!product) {
            // TODO: display an error to the user that the product wasn't found 
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            product: product,
            editIsEnabled: editIsEnabled
        })
    })
}

exports.postEditProduct = (req, res, next) => {
    const existingId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    const updatedProduct = new Product(
        existingId, 
        updatedTitle, 
        updatedImageUrl, 
        updatedPrice, 
        updatedDescription
    );
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Product List',
            path: '/admin/products'
        });
    });
};