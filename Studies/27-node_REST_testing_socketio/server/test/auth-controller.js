const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');


const emptyNextFunction = () => {};
describe('Login', async function () { // done = function to be called once is done to handle async 
    const emptyResponse = {};
    it('should thrown an error with default statuscode 500 if accessing the database fails', async function () {
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
    const DATABASE_I_WANT_TO_CONNECT = 'test-messages'; // TEST DATABASE, NEVER PRODUCTION DATABASE
    const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
    await mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(mongooseConnection => {
       const user = new User({
           email: 'test@test.com',
           password: 'tester',
           name: 'Test',
           posts: [],
           _id: '5c0f66b97af55031b34728a'
       });
       return user.save();
    })
    .then(async (userCreated) => {
        const req = {userId: '5c0f66b97af55031b34728a'};
        const res = {
            statusCode: 500,
            userStatus: undefined,
            status: function(statusCode) {
                this.statusCode = statusCode;
                return this; // returns response object and allows calling .json on it
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        await AuthController
            .getUserStatus(req, res, emptyNextFunction)
            .then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('New user default status')
            })
    })
    .catch(err => { console.log(err)});
    })
});