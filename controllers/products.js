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
    Product.findById(productId)
        .then(([tableEntries, fieldMetadata]) => {
            res.render(
                'shop/product-detail', {
                    pageTitle: product.title,
                    product: tableEntries[0],
                    path: `/products/`
                }
            )
        })
        .catch((error) => { console.log(error)});
}