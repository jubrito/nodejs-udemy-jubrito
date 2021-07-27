const express = require('express');
const path = require('path');

const app = express();

const adminData = require('./routes/admin');
const userRoutes = require('./routes/shop');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // alowing to use the public folder

/* importing admin routes as a middleware needs to occur before the '/' middleware */
app.use('/admin', adminData.routes); 
app.use(userRoutes); 

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'))
});

app.listen(8080); 

// module.exports = path.dirname(require.main.filename);