const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();
const USERNAME_MONGODB = 'jubrito';
const PASSWORD_MONGODB = 'mongoDbPassword';
const DATABASE_I_WANT_TO_CONNECT = 'shop';
const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
console.log(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
const store = new MongoDBStore({
    uri: CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER,
    collection: 'sessions',
    // expires
});

app.set('view engine', 'ejs');
app.set('views', 'views');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

// session middleware to be used for every incoming request.
app.use(expressSession({
    secret: 'this text will be used for signing the hash which secretly stores our ID in the cookie.',
    resave: false, // session will only be saved when the session changes, it won't be saved on every request done on every response sent
    saveUninitialized: false, // ensure that no session gets saved for a request where it doesn't need to be saved because nothing was cahnged about it
    store: store,
    // cookie: {maxAge}
}))

app.use((req, res, next) => {
    if (!req.session.user) {
        return next(); // this middleware will only run if the user is logged in
    }
    User
    .findById(req.session.user._id)
    .then(mongooseModelUser => {
        // use that session data to load our real user, to create our mongoose user model 
        req.user = mongooseModelUser;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 
app.use(authRoutes); 
app.use(errorController.get404);


mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER+'?retryWrites=true&w=majority')
    .then(connectionResult => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'User',
                    email: 'user@email.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(8080);
    })
    .catch(err => console.log(err));

