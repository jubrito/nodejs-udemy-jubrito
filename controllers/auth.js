const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

var nodemailerTransporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7776a05245f738",
      pass: "921d80fe8128c9"
    }
});


exports.getLogin = (req, res, next) => {
    var loginErrorMessage = req.flash('error');
    if (loginErrorMessage.length > 0) {
        loginErrorMessage = loginErrorMessage[0];
    } else {
        loginErrorMessage = false;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        errorMessage: loginErrorMessage
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User
        .findOne({ email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            bcryptjs
                .compare(password, user.password)
                .then(hashedPasswordIsEqualToFielPassword => {
                    if (hashedPasswordIsEqualToFielPassword) {
                        req.session.isAuthenticated = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            // make sure the session was created before you continue, so it doesn't redirect before updating the session
                            console.log(err);
                            res.redirect('/'); // with save we redirect only after creating the session
                        });
                    }
                    req.flash('error', 'Invalid email or password');
                    return res.redirect('/login');
                })
                .catch(err => {
                    res.redirect('/');
                    console.log(err);
                }) 
        }).catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    var loginErrorMessage = req.flash('error');
    if (loginErrorMessage.length > 0) {
        loginErrorMessage = loginErrorMessage[0];
    } else {
        loginErrorMessage = false;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'signup',
        isAuthenticated: false, 
        errorMessage: loginErrorMessage
    })
}
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const ERROR_VALIDATION_FAILED = 422;
        return res.status(ERROR_VALIDATION_FAILED).render('auth/signup', {
            path: '/signup',
            pageTitle: 'signup',
            isAuthenticated: false, 
            errorMessage: errors.array()
        }); 
    }
    User
        .findOne({email: email})
        .then(userWithEmailThatAlreadyExists => {
            if (userWithEmailThatAlreadyExists) {
                req.flash('error', 'Email already exists. Choose a different one!');
                return res.redirect('/signup'); 
            }
            const howManyRoundsOfHashingWillBeAppliedToTheField = 12;// the higher the value the longer will take but the more secure it will be
            return bcryptjs
                .hash(password, howManyRoundsOfHashingWillBeAppliedToTheField)
                .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return user.save();
            })
            .then(newUser => {
                res.redirect('/login');
                return nodemailerTransporter.sendMail({
                    from: 'jujubrito@outlook.com',
                    to: email,
                    subject: 'Sign up succeeded!',
                    html: '<h1>You successfully signed up!</h1>'
                });
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => console.log(err));
}

exports.getResetPassword = (req, res, next) => {
    var resetPasswordErrorMessage = req.flash('error');
    if (resetPasswordErrorMessage.length > 0) {
        resetPasswordErrorMessage = resetPasswordErrorMessage[0];
    } else {
        resetPasswordErrorMessage = false;
    }
    res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset password',
        errorMessage: resetPasswordErrorMessage
    })
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex'); // convert hexadecimal values to normal ASCII characters
        User
            .findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with found with this email ');
                    return res.redirect('/reset-password');
                }
                const oneHourInMilliseconds = 3600000;
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + oneHourInMilliseconds;
                return user.save();
            })
            .then(resetPasswordTokenWasGenerated => {
                if (resetPasswordTokenWasGenerated) {
                    res.redirect('/');
                    nodemailerTransporter.sendMail({
                        from: 'jujubrito@outlook.com',
                        to: req.body.email,
                        subject: 'Password Reset',
                        html: `<a href="http://localhost:8080/reset-password/${token}">click here to reset your password</a>`
                    });
                }
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    var resetPasswordErrorMessage = req.flash('error');
    if (resetPasswordErrorMessage.length > 0) {
        resetPasswordErrorMessage = resetPasswordErrorMessage[0];
    } else {
        resetPasswordErrorMessage = false;
    }
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now() // if the token expiration is greater than now (in the future)
        }
    })
        .then(userThatPasswordWillBeRestored => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New password',
                errorMessage: resetPasswordErrorMessage,
                userId: userThatPasswordWillBeRestored._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let userThatPasswordWillBeRestored;
    User
        .findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        })
        .then(user => {
            userThatPasswordWillBeRestored = user;
            return bcryptjs.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            userThatPasswordWillBeRestored.password = hashedPassword;
            userThatPasswordWillBeRestored.resetToken = undefined;
            userThatPasswordWillBeRestored.resetTokenExpiration = undefined;
            return userThatPasswordWillBeRestored.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
}