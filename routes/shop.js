const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const stripe = require("stripe")("sk_test_51JcwckHD46cEBk2nJuf5mtFyIS8U4T7KsBzU0ukDXjPfOcoIhdAylnfIBjqsVcrC8UJQT03ez1IPI36kNBy5GuCl0011IBaah5");

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/', shopController.getIndex);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

module.exports = router;