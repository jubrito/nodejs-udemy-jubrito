const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // on the front-end we have: headers: {Authorization: 'Bearer ' + this.props.token }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'privateKeyICreatedWhichIsUsedForSigningUpAndIsOnlyKnownToTheServerSoItCantBeFakeOnTheClient');
    } catch (err){
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}