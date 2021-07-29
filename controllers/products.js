const products = [];

exports.getAddProduct = (req, resp, next) => {
    /* Loading EJS files - Template Engines */
    resp.render('./add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, resp, next) => {
    products.push({ title: req.body.title });
    resp.redirect('/');
};

exports.getProducts = (req, resp, next) => {
    resp.render('./shop', {
        products: products, 
        pageTitle: 'Shop', 
        path: '/', 
    }); 
}