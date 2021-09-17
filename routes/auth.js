const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((fieldValue, {req}) => {
                if (fieldValue === 'forbidden@example.com') {
                    throw new Error('This email address is forbidden')
                }
            }), 
        body(
            'password',
            'Please enter a valid password with at least 6 characters '
        )
            .isLength({ min: 6 })
    ],
    authController.postSignup
);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

// router.post('/signup', authController.postSignup);

module.exports = router;