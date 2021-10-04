const User = require('../models/user');
const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let userFoundOnTheDatabaseWithLoginEmail;
    User
        .findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401; // not authenticated
                throw error;
            }
            userFoundOnTheDatabaseWithLoginEmail = user;
            return bcrypt.compare(password, user.password);
        })
        .then(userEnteredACorrectPassord => {
            if (!userEnteredACorrectPassord) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const privateKeyForAuthentication = 'privateKeyICreatedWhichIsUsedForSigningUpAndIsOnlyKnownToTheServerSoItCantBeFakeOnTheClient';
            const jsonToken = jsonwebtoken.sign(
                {
                    email: userFoundOnTheDatabaseWithLoginEmail.email,
                    userId: userFoundOnTheDatabaseWithLoginEmail._id.toString()
                }, 
                privateKeyForAuthentication,
                { expiresIn: '1h'}
            );
            res.status(200).json({ token: jsonToken, userId: userFoundOnTheDatabaseWithLoginEmail._id.toString() })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getUserStatus = (req, res, next) => {
    const userId = req.userId;
    User
        .findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ userId: userId, status: user.status })
            return user.status;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateUserStatus = (req, res, next) => {
    const userId = req.userId;
    const status = req.body.status;
    User
        .findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            user.status = status;
            return user.save();
        })
        .then(result => {
            console.log('result');
            console.log(result);
            res.status(200).json({ message: 'Status updated' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
        })
}