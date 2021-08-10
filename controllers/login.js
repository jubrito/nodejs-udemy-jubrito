const User = require('../models/user');

exports.getCreateUser = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Create a new user',
        path: '/user'
    })
}
exports.getCreateUser = (req, res, next) => {
    const user = new User('jubrito', 'jubrito@email.com');
    user.save()
        .then(user => {
        console.log(user);
    }).catch(err => { console.log(err) });
}