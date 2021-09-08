const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

// // router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postCreateOrder);

router.get('/', shopController.getIndex);

module.exports = router;