const express = require('express');

const responseHandler = require('./response-handler');

const app = express();

app.get('/', responseHandler);

app.listen(3000);
