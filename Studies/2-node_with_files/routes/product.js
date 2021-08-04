const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

router.get('/products', productsController.getProducts);

// Dynamic routes must always be at the end and after /delete etc
router.get('/products/:productId', productsController.getProductById);

module.exports = router;