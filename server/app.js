const express = require('express');
const feedRoutes = require('./routes/feed');

const app = express();

app.use(express.json()); // parse incoming requests (json data)

app.use(function addHeadersToEveryRequestMiddleware (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // all domains should be able to access our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // origins can use http methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // clients can send requests that hold extra authorization data on the header and defines the content type of the request
    next();
})
app.use('/feed', feedRoutes);
app.listen(8080);