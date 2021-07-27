const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, resp, next) => {
    const products = adminData.products;
    /* Loading HTML files */
    // resp.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    resp.sendFile(path.join(rootDir, 'views', 'shop.html')); 
    /* Loading Pug files - Template Engines */
    console.log(products)
    console.log(products.length);
    resp.render('shop', {products: products, pageTitle: 'Shop', path: '/'}); // we don't need to put shop.pug because we defined pug as the template engine on the App File
});

module.exports = router;