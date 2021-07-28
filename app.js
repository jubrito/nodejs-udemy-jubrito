const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');

const app = express();

app.set('view engine', 'ejs');

const adminData = require('./routes/admin');
const userRoutes = require('./routes/shop');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminData.routes); 
app.use(userRoutes); 

app.use((req, res, next) => {
    res.status(404).render('not-found', { pageTitle: 'Page not found', path: ''});
});

app.listen(8080); 
