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
    User.findByPk('6112b2841a0f930bf2374076')
        .then(user => {
            /*  User was undefined but after this we are storing the new user created first when the sequelize is runned. This is only going to happen by demand this the middleware it is just registered and runned when the request is triggered
                User is a sequilize object with the values stored in the database along with the sequelize methods like .destroy*/
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
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(8080); 
})


