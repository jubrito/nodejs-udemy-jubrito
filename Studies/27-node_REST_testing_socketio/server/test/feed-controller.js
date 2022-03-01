const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');


const emptyNextFunction = () => {};
describe('Feed Controller', function () {
    let userId;
    before(async function() {
        const USERNAME_MONGODB = 'juliana';
        const PASSWORD_MONGODB = 'Q1YDy6wD9O1iQeBn';
        const DATABASE_I_WANT_TO_CONNECT = 'test-messages'; // TEST DATABASE, NEVER PRODUCTION DATABASE
        const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
        await mongoose
        .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
        .then(mongooseConnection => {
            const user = new User({
                email: 'testfeed@test.com',
                password: 'tester feed',
                name: 'Test Feed',
                posts: [],
                _id: '55153a8014829a865bbf700d'
            });
            return user.save().then(user => {
                userId = user._id.toString();
            });
        })
    })

    it('should create a post and add it to the posts of the creator', async function () {
        const req = {
            body: {
                title: 'New Test Post',
                content: 'Content of new Test Post'
            },
            file: {
                path: 'anyrandompath'
            },
            userId: userId
        };
        const res = { 
            status: function() {
                return this; // returns a reference to the entire object which has reference to json (since we access it by res.status().json)
            }, 
            json: function() {} 
        };

        FeedController
            .postPosts((req, res, emptyNextFunction))
            .then((updatedUser) => {
                console.log('updatedUser')
                console.log(updatedUser)
                expect(updatedUser).to.have.property('posts');
                expect(updatedUser.posts).to.have.length(1);
            })
        // const res = {
        //     statusCode: 500,
        //     userStatus: undefined,
        //     status: function(statusCode) {
        //         this.statusCode = statusCode;
        //         return this; // returns response object and allows calling .json on it
        //     },
        //     json: function(data) {
        //         this.userStatus = data.status;
        //     }
        // };
        // await AuthController
        //     .getUserStatus(req, res, emptyNextFunction)
        //     .then(() => {
        //         expect(res.statusCode).to.be.equal(200);
        //         expect(res.userStatus).to.be.equal('New user default status');
        //     })
    });

    after(async function() {
        await User
            .deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            });
    })
});

