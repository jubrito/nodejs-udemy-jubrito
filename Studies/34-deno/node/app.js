const express = require('express');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(express.json()); // parse all incoming requests, check if there is any json data and if they do, the json data will be parsed and will be made available as a javascript object

app.use(todoRoutes);

app.listen(3000);