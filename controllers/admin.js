const Product = require('../models/product');

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
    // userId: req.user.id // after creating the relations, this column was created and it stores the foreign key for the user table (using the id) and the association between the two tables

    /* How to imediatlly save in the database if we have no relations between tables 
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }) */

    /* How to save in the database if we have relations 
    Sequelize automatically adds a create product method to the user because of the belongsTo and hasMany associations we created on app.js */
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
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
    Product.findByPk(productId)
        .then(product => {
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
    
    Product.findByPk(existingId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save(); // if it already exists it will update
        })
        // it will handle any successful responses for the promisse when it saves
        .then(resultAfterSaving => {
            res.redirect('/admin/products')
        })
        .catch(error => { // catches errors for both promisses
            console.log(error);
        })
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
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

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then(product => {
           return product.destroy();
        })
        .then(resultAfterProductIsDestroyed => {
            res.redirect('/admin/products');
        })
        .catch();
}