const express = require('express');
const { dirname } = require('path');
const path = require('path');

const userRoutes = require('../3/routes/user');

const app = express();

app.use('/', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);