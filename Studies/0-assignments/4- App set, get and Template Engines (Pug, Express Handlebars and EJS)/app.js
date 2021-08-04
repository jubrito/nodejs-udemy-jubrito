const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');

const app = express();

// Applications Settings (global variables and configurations)
app.set('globalExpressValueICreated', 'value')
app.get('globalExpressValueICreated'); // using it anywhere

/* PUG - Template Engine
app.set('view engine', 'pug'); // telling express that we want to compile dynamic templates with the pug engine
app.set('views', 'views'); // where to find the pug template engine templates, tecnically you just need to set this if you have a folder with a name different than views, otherwise is views by default
*/

/* EXPRESS HANDLEBARS - Template Engine 
app.engine(
    'handlebars', // name chosen
    expressHandlebars({
        layoutsDir: 'views/layouts', 
        defaultLayout: 'main-layout',
        extname: 'handlebars', // if we used another name besides handlebars, we would have to configure this to make it work. If you use handlebars just like I did it is not necessary
    })); // the function returns the initialized view engine
app.set('view engine', 'handlebars'); 
*/

/* EJS - Template Engine, writes on .ejs with vanilla javascript */
app.set('view engine', 'ejs');

const adminData = require('./routes/admin');
const userRoutes = require('./routes/shop');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // alowing to use the public folder

/* importing admin routes as a middleware needs to occur before the '/' middleware */
app.use('/admin', adminData.routes); 
app.use(userRoutes); 

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
    res.status(404).render('./ejs/not-found', { pageTitle: 'Page not found'});
});

app.listen(8080); 

// module.exports = path.dirname(require.main.filename);