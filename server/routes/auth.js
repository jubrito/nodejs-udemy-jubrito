const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid e-mail')
            .custom((value, { req }) => {
                return User
                    .findOne({ email: value })
                    .then(userObjectFoundInTheDb => {
                        if (userObjectFoundInTheDb) {
                            return Promise.reject('E-mail address already exists'); // validation fails
                        }
                    })
            }),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .isLength({ min: 5 })
            .not().isEmpty(),
    ],
    authController.getSignUp
);

module.exports = router;