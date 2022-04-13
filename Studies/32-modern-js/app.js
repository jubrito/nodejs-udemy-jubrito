// const express = require('express');
// const responseHandler = require('./response-handler');
import express from 'express';

/* Import without { } because responseHandler is exported through export.default */
import responseHandlerWithExportDefault from './response-handler.js';
import { responseHandlerExportedDirectly } from './responseHandlerExportedDirectly.js';

const app = express();

app.get('/module-exports', responseHandlerWithExportDefault);
app.get('/export-const-directly', responseHandlerExportedDirectly);

app.listen(3000);
