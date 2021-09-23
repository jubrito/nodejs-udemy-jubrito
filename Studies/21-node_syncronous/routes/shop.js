const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const router = express.Router();

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

// // router.get('/checkout', shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/', shopController.getIndex);

module.exports = router;