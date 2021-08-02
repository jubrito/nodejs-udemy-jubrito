const Product = require('../models/product');

exports.getProducts = (req, resp, next) => {
    Product.fetchAll((products) => {
        resp.render('shop/product-list', { 
            products: products, 
            pageTitle: 'All products', 
            path: '/products', 
        }); 
    });
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        // You can't log asynchronous function but we use the callback to do it
        res.render(
            'shop/product-detail', {
                pageTitle: `Product ${product.title}`,
                product: product,
                path: `/products/${product.productId}`
            }
        )
        return product;
    })
}