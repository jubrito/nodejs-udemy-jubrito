const User = require("../models/user");
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const cookieNameAndValue = req.get('Cookie');
    // const isAuthenticated = cookieNameAndValue.trim().split('=')[1];
    // console.log(cookieNameAndValue);
    // console.log(cookieValue);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: req.session.isAuthenticated, 
    })
}

exports.postLogin = (req, res, next) => {
    User
    .findById('612cf29d744acef2c2f9d419')
    .then(user => {
        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.save((err) => {
             // make sure the session was created before you continue, so it doesn't redirect before updating the session
             console.log(err);
             res.redirect('/'); // redirect only after creating the session
        });
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'signup',
        isAuthenticated: false, 
    })
}
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User
        .findOne({email: email})
        .then(userWithEmailThatAlreadyExists => {
            if (userWithEmailThatAlreadyExists) {
                return res.redirect('/signup');
            }
            const howManyRoundsOfHashingWillBeAppliedToTheField = 12;// the higher the value the longer will take but the more secure it will be
            return bcryptjs.hash(password, howManyRoundsOfHashingWillBeAppliedToTheField);
        })
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
        })
        .catch(err => console.log(err));
}