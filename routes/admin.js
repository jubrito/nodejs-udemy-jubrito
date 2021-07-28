const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app
const rootDir = require('../util/path');

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, resp, next) => {
    /* Loading EJS files - Template Engines */
    resp.render('./add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
    });
});

// /admin/add-product => POST
router.post('/add-product', (req, resp, next) => {
    products.push({ title: req.body.title });
    resp.redirect('/');
});

exports.routes = router;
exports.products = products;