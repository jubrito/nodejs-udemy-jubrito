const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const shopRoutes = require('./routes/shop');
const database = require('./util/database'); // connection pool

// Get back promises when executing queries with execute
database.execute('SELECT * FROM products')
        .then(result => {
            const dataAddedToTheTable = result[0];
            const tableMetadata = result[1];
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 

app.listen(8080); 
