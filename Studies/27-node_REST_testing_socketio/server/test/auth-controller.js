const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');


const emptyNextFunction = () => {};
describe('Auth Controller - Login', async function () {
    const emptyResponse = {};
    before(async function() {
        const USERNAME_MONGODB = 'juliana';
        const PASSWORD_MONGODB = 'Q1YDy6wD9O1iQeBn';
        const DATABASE_I_WANT_TO_CONNECT = 'test-messages'; // TEST DATABASE, NEVER PRODUCTION DATABASE
        const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
        await mongoose
        .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
        .then(mongooseConnection => {
            const user = new User({
                email: 'testAuthControllerLogin@test.com',
                password: 'tester',
                name: 'Test Auth Controller Login',
                posts: [],
                _id: '55153a8014829a865bbf700d'
            });
            return user.save();
        })
    })

    it('should thrown an error with default statuscode 500 if accessing the database fails on Login', async function () {
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

    it('should send a response with a valid user status for an existing user - User Status', async function () {
        const req = {userId: '55153a8014829a865bbf700d'};
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
                expect(res.userStatus).to.be.equal('New user default status');
            })
    });

    after(async function() {
        await User
            .deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            });
    })
});

