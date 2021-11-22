const expect = require('chai').expect;
const authMiddleware = require('../middlewares/is-auth');

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
                return 'incompleteauthorizationheader';
            }
        };
        expect(authMiddleware.bind(this, req, emptyResponse, emptyNextFunction)).to.throw();
    });
})