const expect = require('chai').expect;
const authMiddleware = require('../middlewares/is-auth');

it('should throw an error when no authorization header is present', function () {
    const reqWithoutHeader = {
        get: function() {
            return null;
        }
    };
    const response = {};
    
    // Bind allows to pass a function reference to Mocha and Chai instead of running the function (and throwing an error).
    expect(authMiddleware.bind(this, reqWithoutHeader, response, () => {})).to.throw("Not Authenticated");

})