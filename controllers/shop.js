
exports.getCart = (req, resp, next) => {
    resp.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    })
}

exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}