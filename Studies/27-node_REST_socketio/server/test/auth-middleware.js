const authMiddleware = require('../middlewares/is-auth');

it('should throw an error when no authorization header is present', function () {
    const req = {
        get: function() {
            
        }
    }
})