const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, resp, next) => {
    resp.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editIsEnabled: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, price, description, imageUrl)
    
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(error);
        })
};

exports.getEditProduct = (req, res, next) => {
    const editIsEnabled = req.query.edit;
    const productId = req.params.productId;
    if (!editIsEnabled) {
        return res.redirect('/');
    }
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                product: product,
                editIsEnabled: editIsEnabled
            })
        }).catch(error => {
            console.log(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const existingId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    const product = new Product (
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        existingId
    )
    product
        .save()
        .then(resultAfterSaving => {
            res.redirect('/admin/products')
        })
        .catch(error => { // catches errors for both promisses
            console.log(error);
        })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/product-list', {
                products: products,
                pageTitle: 'Admin Product List',
                path: '/admin/products'
            });
        })
        .catch(error => {
            console.log(error);
        })
};

// exports.postDeleteProduct = (req, res, next) => {
//     const productId = req.body.productId;
//     Product.findByPk(productId)
//         .then(product => {
//            return product.destroy();
//         })
//         .then(resultAfterProductIsDestroyed => {
//             res.redirect('/admin/products');
//         })
//         .catch();
// }