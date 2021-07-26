const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app

// /admin/add-product => GET
router.get('/add-product', (req, resp, next) => {
    resp.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, resp, next) => {
    console.log(req.body);
    return resp.redirect('/');
});

module.exports = router;