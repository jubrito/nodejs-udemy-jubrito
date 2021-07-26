const express = require('express');
const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

//  PARSE REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: true }));

app.use('/admin', adminRoutes); // importing admin routes as a middleware, needs to be before the '/' middleware
app.use(userRoutes); 

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'))
});

app.listen(8080); 

// module.exports = path.dirname(require.main.filename);