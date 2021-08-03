const Product = require('../models/product');

exports.getProducts = (req, resp, next) => {
    Product.fetchAll()
        .then(([tableEntries, fieldMetadata]) => {
            resp.render('shop/product-list', { 
                products: tableEntries, 
                pageTitle: 'All products', 
                path: '/products', 
            }); 
        })
        .catch(error => console.log(error));
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