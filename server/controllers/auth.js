const User = require('../models/user');
const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getSignUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.errorsArray = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const strongStrength = 12;
    bcrypt
    .hash(password, strongStrength)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        return user.save();
    })
    .then(result => {
        res.status(201).json({ message: 'User created successfully', userId: result._id });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}