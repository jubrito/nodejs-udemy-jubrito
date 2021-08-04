const express = require('express');
const path = require('path');
const router = express.Router(); // mini express app

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

// router.get('/delete-product/productId', adminController.postDeleteProduct);

router.post('/delete-product', adminController.postDeleteProduct);


module.exports = router;