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
const Product = require('./models/product'); 
const User = require('./models/user'); 

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 

app.use(errorController.get404);

const howTheRelashionshipWillBeManaged = {
    constraints: true,
    onDelete: 'CASCADE' // if you delete an user any products related will also be deleted
}
Product.belongsTo(User, howTheRelashionshipWillBeManaged);
User.hasMany(Product);

// Syncs the model you created to the database by creating the table and if you have them, relations
sequelize
    .sync({ force: true }) // force true only if you want to overwright tables (CAUTION PRODUCTION)
    .then(result => {
        app.listen(8080) 
    })
    .catch(error => {
        console.log(error)
    });

