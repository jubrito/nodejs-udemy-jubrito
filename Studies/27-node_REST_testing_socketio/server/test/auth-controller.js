const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');


describe ('Auth Controller - Login', async function () { // done = function to be called once is done to handle async 
    const emptyResponse = {};
    const emptyNextFunction = () => {};
    it('should thrown an error with default statuscode 500 if accessing the database fails', function () {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }
        await AuthController
            .login(req, emptyResponse, emptyNextFunction)
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            })
        User.findOne.restore();
    })
});