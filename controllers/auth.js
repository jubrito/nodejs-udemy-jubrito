exports.getLogin = (req, res, next) => {
    const cookieNameAndValue = req.get('Cookie');
    const isAuthenticated = cookieNameAndValue.trim().split('=')[1];
    console.log(cookieNameAndValue);
    console.log(cookieValue);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: isAuthenticated, 
    })
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'isAuthenticated=true;');
    res.redirect('/');
}