const Product = require('../models/product');

exports.getProducts = (req, resp, next) => {
    Product.find()
        .then(products => {
            resp.render('shop/product-list', { 
                products: products, 
                pageTitle: 'All products', 
                path: '/products', 
            }); 
        }).catch(error => {
            console.log(error)
        });
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render(
                'shop/product-detail', {
                    pageTitle: product.title,
                    product: product,
                    path: '/products/'
                }
            )
        })
        .catch((error) => {console.log(error)});
}