const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app

const productsController = require('../controllers/products');

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;