// const express = require('express');
// const responseHandler = require('./response-handler');
import express from 'express';

/* Import without { } because responseHandler is exported through export.default */
import responseHandlerWithExportDefault_WithPromises from './response-handler.js';
import { responseHandlerExportedDirectly_WithCallback } from './responseHandlerExportedDirectly.js';

const app = express();

app.get('/module-exports', responseHandlerWithExportDefault_WithPromises);
app.get('/export-const-directly', responseHandlerExportedDirectly_WithCallback);

app.listen(3000);
