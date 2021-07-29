const express = require('express');
const { readFile } = require('fs');
const path = require('path');
const router = express.Router(); // mini express app

const adminController = require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getAdminProducts);

module.exports = router;