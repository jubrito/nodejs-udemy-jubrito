const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const router = express.Router(); // mini express app
const { body } = require('express-validator');

router.get(
    '/add-product', 
    isAuth, 
    adminController.getAddProduct
);

router.post(
    '/add-product', 
    isAuth, 
    [
        body('title', 'Enter a valid title using at least 2 characters or numbers')
            .isString()
            .isLength({ min: 2 })
            .trim(),
        body('price', 'Enter a valid price')
            .isFloat(),
        body('description', 'Enter a valid description with at least 5 characters')
            .isLength({ min: 5, max: 500 })
            .trim()
    ], 
    adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product', 
    isAuth, 
    [
        body('title', 'Enter a valid title using at least 2 characters or numbers')
            .isAlphanumeric()
            .isLength({ min: 2 })
            .trim(),
        body('price', 'Enter a valid price')
            .isFloat(),
        body('description', 'Enter a valid description with at least 5 characters')
            .isLength({ min: 5, max: 500 })
            .trim()
    ], 
    adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;