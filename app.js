const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminRoutes); 
app.use(userRoutes); 

app.use(errorController.get404);

app.listen(8080); 
