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
    // res.setHeader('Set-Cookie', 'isAuthenticated=true; httpOnly');
    User
    .findById('612cf29d744acef2c2f9d419')
    .then(user => {
        req.session.isAuthenticated = true;
        req.session.user = user;
        res.redirect('/');
    })
    .catch(err => console.log(err))
    res.redirect('/');
}

exports.postLogout = (req, res, next) => {
    function calledAfterDestroyingTheSession (err) {
        console.log(err);
        res.redirect('/');
    }

    req.session.destroy(calledAfterDestroyingTheSession());
}