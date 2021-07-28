const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, resp, next) => {
    const products = adminData.products;
    /* Loading HTML files 
    resp.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    resp.sendFile(path.join(rootDir, 'views', 'shop.html')); */

    /* Loading Pug files - Template Engines 
    resp.render('./pug/shop', {products: products, pageTitle: 'Shop', path: '/'}); // we don't need to put shop.pug because we defined pug as the template engine on the App File */
    
    /* Loading Express Handlebars files - Template Engines 
    resp.render('./expressHandlebars/shop', {
        products: products, 
        pageTitle: 'Shop', 
        path: '/', 
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        // layout: true, // is true by default
    }); */
    /* Loading EJS files - Template Engines */
    resp.render('./ejs/shop', {
        products: products, 
        pageTitle: 'Shop', 
        path: '/', 
    }); 
});

module.exports = router;