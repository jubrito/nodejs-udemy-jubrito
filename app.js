const express = require('express');
const feedRoutes = require('./routes/feed');

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // parse incoming requests (json data)
app.use('/feed', feedRoutes);
app.listen(8080);