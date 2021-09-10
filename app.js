const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();

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
    // cookie: {maxAge}
}))

app.use((req, res, next) => {
    User.findById('612cf29d744acef2c2f9d419')
        .then(user => {
            /*  User model with methods and variables registered and accesible as middleware */
            req.user = user;
            next();
        })
        .catch(error => {
        console.log(error);
        })
})
app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 
app.use(authRoutes); 
app.use(errorController.get404);

const username = 'juliana';
const password = 'ar6tE3vMlcpFT4OW';
const databaseIWantToConnect = 'shop';
const connectionStringFromMongodbWebsiteCluster = `mongodb+srv://${username}:${password}@clusterbackend0.luzfp.mongodb.net/${databaseIWantToConnect}?retryWrites=true&w=majority`;
mongoose
    .connect(connectionStringFromMongodbWebsiteCluster)
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

