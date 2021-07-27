const express = require('express');
const path = require('path');

const app = express();

// Applications Settings (global variables and configurations)
app.set('globalExpressValueICreated', 'value')
app.get('globalExpressValueICreated'); // using it anywhere
app.set('view engine', 'pug'); // telling express that we want to compile dynamic templates with the pug engine
app.set('views', 'views'); // where to find the pug template engine templates.

const adminData = require('./routes/admin');
const userRoutes = require('./routes/shop');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // alowing to use the public folder

/* importing admin routes as a middleware needs to occur before the '/' middleware */
app.use('/admin', adminData.routes); 
app.use(userRoutes); 

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
    res.status(404).render('not-found', { pageTitle: 'Page not found'});
});

app.listen(8080); 

// module.exports = path.dirname(require.main.filename);