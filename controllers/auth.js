exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: req.isAuthenticated,
    })
}

exports.postLogin = (req, res, next) => {
    req.isAuthenticated = true;
    res.redirect('/');
}