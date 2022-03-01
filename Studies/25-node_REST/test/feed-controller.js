const expect = require('chai').expect;
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');


const emptyNextFunction = () => {};
describe('Feed', async function () {
    let userId;
    before(async function() {
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
            });
            return user.save().then((user) => {
                userId = user._id.toString();
            });
        })
    })

    it('should add a created post to the posts of the creator', async function () {
        const req = {
            body: {
                title: 'Test Title',
                content: 'Test Content',
            },
            file: { path: 'anyPathFileCauseItsAMock'},
            userId: userId // 5c0f66b979af55031b34728a
        }; 
        const res = {
            status: function() {
                return this; // returns response object and allows calling .json on it
            },
            json: function() {}
        };
        await FeedController
            .postPosts(req, res, emptyNextFunction)
            .then((updatedUser) => {
                console.log('res', res);
                expect(updatedUser).to.have.property('posts');
                expect(updatedUser).to.have.length(1);
            })
    });

    after(async function() {
        await User
            .deleteMany({})
            .then(() => {
                mongoose.disconnect();
            });
    })

});

