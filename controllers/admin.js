const Product = require('../models/product');

exports.getAddProduct = (req, resp, next) => {
    resp.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editIsEnabled: false,
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

exports.getEditProduct = (req, res, next) => {
    const editIsEnabled = req.query.edit;
    const productId = req.params.productId;
    console.log(editIsEnabled)
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
            path: `/admin/edit-product`,
            product: product,
            editIsEnabled: editIsEnabled,
        })
    })
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