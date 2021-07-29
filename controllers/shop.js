
exports.getIndex = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'
    });
}
exports.getCart = (req, resp, next) => {
    resp.render('shop/cart', {
        pageTitle: 'Your cart',
        path: '/cart'
    });
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