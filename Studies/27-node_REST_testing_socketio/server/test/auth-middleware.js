const expect = require('chai').expect;
const authMiddleware = require('../middlewares/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth middleware', function() {
    const emptyResponse = {};
    const emptyNextFunction = () => {};
    it('should throw an error when no authorization header is present', function () {
        const reqWithoutHeader = {
            get: function() {
                return null;
            }
        };
        // Bind allows to pass a function reference to Mocha and Chai instead of running the function (and throwing an error).
        expect(authMiddleware.bind(this, reqWithoutHeader, emptyResponse, emptyNextFunction)).to.throw("Not Authenticated");
    });
    it('should throw and error if the authorization header is only one string', function () {
        const req = {
            get: function() {
                return 'incompleteAuthorizationHeader';
            }
        };
        expect(authMiddleware.bind(this, req, emptyResponse, emptyNextFunction)).to.throw();
    });
    it('should throw an error if the token cannot be verified', function() {
        const reqWithInvalidToken = {
            get: function() {
                return 'Bearer invalidToken';
            }
        };
        expect(authMiddleware.bind(this, reqWithInvalidToken, emptyResponse, emptyNextFunction)).to.throw();
    });
    it('should yield an userId after decoding the token', function() {
        const reqWithValidToken = {
            get: function() {
                return 'Bearer tokenPretendingToBeValid';
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'userIdGeneratedByThisMockThatRewritesJwtVerifyFunction' });
        authMiddleware(reqWithValidToken, emptyResponse, emptyNextFunction);
        expect(reqWithValidToken).to.have.property('userId', 'userIdGeneratedByThisMockThatRewritesJwtVerifyFunction');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
})