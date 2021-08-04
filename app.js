const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database'); 


//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 

app.use(errorController.get404);

// Syncs the model you created to the database by creating the table and if you have them, relations
sequelize
    .sync()
    .then(result => {
        app.listen(8080) 
    })
    .catch(error => {
        console.log(error)
    });

