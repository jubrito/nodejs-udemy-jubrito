const express = require('express');
const feedRoutes = require('./routes/feed');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const USERNAME_MONGODB = 'juliana';
const PASSWORD_MONGODB = 'ar6tE3vMlcpFT4OW';
const DATABASE_I_WANT_TO_CONNECT = 'messages';
const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;

app.use(express.json()); // parse incoming requests (json data)
app.use(function addHeadersToEveryRequestMiddleware (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // all domains should be able to access our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // origins can use http methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // clients can send requests that hold extra authorization data on the header and defines the content type of the request
    next();
})
app.use('/feed', feedRoutes);
// Statically serving images
app.use('/images', express.static(path.join(__dirname,'images')));
// Error Handling Middleware
app.use((errorThrownOrPassedThroughNext, req, res, next) => {
    console.log(errorThrownOrPassedThroughNext);
    const statusCode = errorThrownOrPassedThroughNext.statusCode || 500;
    const messagePassedViaErrorConstructor = errorThrownOrPassedThroughNext.message; 
    res.status(statusCode).json({message: messagePassedViaErrorConstructor})
})

mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => { console.log(err)});