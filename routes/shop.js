const path = require('path');
const express = require('express');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, resp, next) => {
    const products = adminData.products;
    /* Loading EJS files - Template Engines */
    resp.render('./shop', {
        products: products, 
        pageTitle: 'Shop', 
        path: '/', 
    }); 
});

module.exports = router;