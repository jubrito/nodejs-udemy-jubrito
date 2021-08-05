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
const Cart = require('./models/cart'); 
const CartItem = require('./models/cart-item'); 
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req, res, next) => {
    User.findByPk(1)
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


const howTheRelashionshipWillBeManaged = {
    constraints: true,
    onDelete: 'CASCADE' // if you delete an user any products related will also be deleted
}

Product.belongsTo(User, howTheRelashionshipWillBeManaged);
User.hasMany(Product);
/* Either of the two approaches below will add a key to the cart, the user id to which the cart belongs.*/
User.hasOne(Cart);
Cart.belongsTo(User);

/* The two approaches only work with an intermediate table that connects them which basically stores a combination
of product IDs and cart IDs (whereTheConnectionShouldBeStored = CartItem).*/
const whereTheConnectionShouldBeStored = {
    through: CartItem
}
Cart.belongsToMany(Product, whereTheConnectionShouldBeStored);
Product.belongsToMany(Cart, whereTheConnectionShouldBeStored);

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Syncs the model you created to the database by creating the table and if you have them, relations
sequelize
    // .sync({ force: true }) // force true only if you want to overwrite tables (CAUTION PRODUCTION)
    .sync() 
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user){
            return User.create({ name: 'Ju', email: 'ju@email.com'});
        }
        /* Promise.resolve(user) return as the new one we return a user in the format of a promisse that resolves immediately but this is how it works if you return an user inside a promise by default
        return Promise.resolve(user);  */
        return user; 
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(8080); 
    })
    .catch(error => {
        console.log(error)
    });

