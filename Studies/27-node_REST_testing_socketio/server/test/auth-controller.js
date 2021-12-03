const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');


describe('Login', async function () { // done = function to be called once is done to handle async 
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

describe('User Status', function () {
    it('should send a response with a valid user status for an existing user', async function () {
    const USERNAME_MONGODB = 'juliana';
    const PASSWORD_MONGODB = 'ar6tE3vMlcpFT4OW';
    const DATABASE_I_WANT_TO_CONNECT = 'test-messages';
    const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
    await mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(mongooseConnection => {
       const user = new User({
           email: 'test@test.com',
           password: 'tester',
           name: 'Test',
           posts: [],
       });
       return user.save();
    })
    .then(userCreated => {

    })
    .catch(err => { console.log(err)});
    })
});