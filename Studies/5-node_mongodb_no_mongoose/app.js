const express = require('express');
const path = require('path');

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req, res, next) => {
    User.findById('6143a4463b3a7cf405ad7aed')
        .then(user => {
            console.log(user);
            /*  User model with methods and variables registered and accesible as middleware */
            req.user = new User(user.username, user.email, user.cart, user._id); 
            next();
        })
        .catch(error => {
        console.log(error);
        })
})

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(8080); 
})


