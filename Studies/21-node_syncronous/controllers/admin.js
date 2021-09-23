const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

const UNPROCESSABLE_ENTITY_ERROR = 422; // VALIDATION FAILED

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editIsEnabled: false,
        hasError: false,
        oldInputs: {
            title: '',
            imagePath: '',
            price: '',
            description: ''
        },
        errorMessage: undefined,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!image) {
        return res.status(UNPROCESSABLE_ENTITY_ERROR).render(
            'admin/edit-product', { 
                pageTitle: 'Add Product', 
                path: '/admin/add-product',
                editIsEnabled: false,
                hasError: true,
                errorMessage: 'Attached file is not a valid image',
                product: {
                    title: title,
                    price: price,
                    description: description,
                },
                validationErrors: []
            }
        )
    }
    if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY_ERROR).render(
            'admin/edit-product', { 
                pageTitle: 'Add Product', 
                path: '/admin/add-product',
                editIsEnabled: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: {
                    title: title,
                    price: price,
                    description: description,
                },
                validationErrors: errors.array()
            }
        )
    }
    const imagePath = '/' + image.path;
    const product = new Product({
        title: title,
        price: price,
        description: description, 
        imagePath: imagePath,
        userId: req.user 
    });
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
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
                editIsEnabled: editIsEnabled,
                hasError: false,
                errorMessage: undefined,
                validationErrors: []
            })
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}


exports.postEditProduct = (req, res, next) => {
    const existingId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);
    if (!image) {
        return res.status(UNPROCESSABLE_ENTITY_ERROR).render(
            'admin/edit-product', { 
                pageTitle: 'Add Product', 
                path: '/admin/edit-product',
                editIsEnabled: false,
                hasError: true,
                errorMessage: 'Attached file is not a valid image',
                product: {
                    title: title,
                    price: price,
                    description: description,
                },
                validationErrors: []
            }
        )
    }
    if (!errors.isEmpty()) {
        return res.status(UNPROCESSABLE_ENTITY_ERROR).render(
            'admin/edit-product', { 
                pageTitle: 'Add Product', 
                path: '/admin/edit-product',
                editIsEnabled: true,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: {
                    _id: existingId,
                    title: updatedTitle,
                    price: updatedPrice,
                    description: updatedDescription
                },
                validationErrors: errors.array(),
            }
        )
    }
    Product
        .findById(existingId)
        .then(product => {
            const userHasPermission = product.userId.toString() === req.user._id.toString();
            const imagePath = '/' + image.path;
            if (!userHasPermission) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imagePath = imagePath;
            }
            return product
                .save()
                .then(resultAfterSaving => {
                    res.redirect('/admin/products')
                });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id })
        .then(products => {
            res.render('admin/product-list', {
                products: products,
                pageTitle: 'Admin Product List',
                path: '/admin/products',
            });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'))
            }
            fileHelper.deleteFile(product.imagePath);
            return Product.deleteOne({ _id: productId, userId: req.user._id });
        })
        .then(resultAfterProductIsDestroyed => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            return next(error);
        });
}