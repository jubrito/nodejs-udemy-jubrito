const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(error => {
        console.log(error)
    });
}
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then((cart) => {
            /* Since cart is associated with product (with belongsToMany on app.js) sequelize will 
            look through the CartItem to find the matching products from the cart */
            return cart
                .getProducts()
                .then(cartProducts => {
                    res.render('shop/cart', {
                        pageTitle: 'Your cart',
                        products: cartProducts,
                        path: '/cart'
                    });
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error))
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    let fieldsThatShouldBeSetInTheInBetweenTable = { 
        through: {}
    };

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: { id: productId}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product
            }
            // if the product is not part of the cart yet
            return Product.findByPk(productId)
        })
        .then(product => {
            fieldsThatShouldBeSetInTheInBetweenTable = {
                through: { quantity: newQuantity }
            }
            return fetchedCart.addProduct(product, fieldsThatShouldBeSetInTheInBetweenTable);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => console.log(error))
}
exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId }})
        })
        .then(products => {
            let product = products[0];
            // we only want to remove the product from the in-between cartItem table that connects my cart with that product
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');

        })
        .catch(err => console.log(err));
}

exports.getOrders= (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
    })
}
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}