const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app
const rootDir = require('../util/path');

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, resp, next) => {
    /* Loading HTML files */
    // resp.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
    // resp.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    /* Loading Pug files - Template Engines */
    resp.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product'});
});

// /admin/add-product => POST
router.post('/add-product', (req, resp, next) => {
    products.push({ title: req.body.title });
    resp.redirect('/');
    
});

exports.routes = router;
exports.products = products;