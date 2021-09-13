const User = require("../models/user");

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