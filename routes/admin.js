const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app
const rootDir = require('../util/path');

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, resp, next) => {
    // resp.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
    resp.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, resp, next) => {
    products.push('shop.js', { title: req.body.title });
    resp.redirect('/');
    
});

exports.routes = router;
exports.products = products;