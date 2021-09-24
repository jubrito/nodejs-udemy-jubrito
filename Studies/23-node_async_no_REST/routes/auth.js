const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');


const validEmailMessage = 'Please enter a valid email';
const validPasswordMessage = 'Please enter a valid password with at least 6 characters';
const validEmailAndPasswordMessage = 'Invalid email or password';
const minPasswordLength = 6;

router.get('/login', authController.getLogin);

router.post(
    '/login', 
    [
        check('email', validEmailMessage)
            .isEmail()
            .custom((fieldValue, {req}) => {
                return User
                    .findOne({ email: fieldValue })
                    .then(userWithEmailWasFound => {
                        if (!userWithEmailWasFound) {
                            return Promise.reject(
                                validEmailAndPasswordMessage
                            )
                        }
                    })
            })
            .normalizeEmail(),
        check('password', validEmailAndPasswordMessage)
            .isLength({ min: minPasswordLength })
            .trim()
    ],
    authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup', 
    [
        check('email', validEmailMessage)
            .isEmail()
            .withMessage()
            .normalizeEmail()
            .custom((fieldValue, {req}) => {
                if (fieldValue === 'forbidden@example.com') {
                    throw new Error('This email address is forbidden')
                }
                return User
                    .findOne({email: fieldValue})
                    .then(userWithEmailThatAlreadyExists => {
                        if (userWithEmailThatAlreadyExists) {
                          return Promise.reject(
                            'Email already exists. Choose a different one!'
                          )
                        }
                    })
             }),
        body('password', validPasswordMessage)
            .trim()
            .isLength({ min: minPasswordLength }),
        body('confirmPassword')
            .custom((fieldValue, {req}) => {
                if (fieldValue !== req.body.password) {
                    throw new Error('Passwords have to match');
                }
                return true;
            }
        )
    ],
    authController.postSignup
);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

// router.post('/signup', authController.postSignup);

module.exports = router;