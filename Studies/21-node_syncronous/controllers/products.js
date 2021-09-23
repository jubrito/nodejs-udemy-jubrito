const Product = require('../models/product');

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalNumberOfProducts;
    Product
        .find()
        .countDocuments()
        .then(numberOfProducts => {
            totalNumberOfProducts = numberOfProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'All products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalNumberOfProducts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalNumberOfProducts / ITEMS_PER_PAGE) // ceil rounds up
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
                    path: '/products/',
                }
            )
        })
        .catch((error) => {console.log(error)});
}