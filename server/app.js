const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const auth = require('./middlewares/auth');
const USERNAME_MONGODB = 'juliana';
const PASSWORD_MONGODB = 'ar6tE3vMlcpFT4OW';
const DATABASE_I_WANT_TO_CONNECT = 'messages';
const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;
const errorMessage = undefined;
const destinationFolder = 'images';
let uniqueFileName = '';
const snapShotOfTheCurrentDate = new Date().toISOString();
const multerFileStorage = multer.diskStorage({
    destination: (req, fileData, callbackOnceIsDone) => {
        callbackOnceIsDone(
            errorMessage,
            destinationFolder
        )
    },
    filename: (req, fileData, callbackOnceIsDone) => {
        uniqueFileName = snapShotOfTheCurrentDate + '__' + Math.random().toString() + '__' + fileData.originalname;
        callbackOnceIsDone(
            errorMessage,
            uniqueFileName
        )
    }
});
const multerFileFilter = (req, fileData, callbackOnceIsDone) => {
    let typeOfFileIsAccepted;
    if (fileData.mimetype === 'image/png' || fileData.mimetype === 'image/jpg' || fileData.mimetype === 'image/jpeg') {
        typeOfFileIsAccepted = true;
    } else {
        typeOfFileIsAccepted = false;
    }
    callbackOnceIsDone(
        errorMessage,
        typeOfFileIsAccepted
    )
}
// Parse incoming requests (json data)
app.use(express.json()); 

app.use(function addHeadersToEveryRequestAndHandlesOptionsRequestsMiddleware (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Assuring that Options Requests will never access Graphql endpoints but still get valid response
    // Prevents 'OPTIONS 405 (Method not allowed)' error when the browser sends an options request before it sends the post, patch, put, delete or so on request since GraphQL only accepts POSTSs
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

// Statically serving images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Error Handling Middleware
app.use((errorThrownOrPassedThroughNext, req, res, next) => {
    console.log(errorThrownOrPassedThroughNext);
    const statusCode = errorThrownOrPassedThroughNext.statusCode || 500;
    const messagePassedViaErrorConstructor = errorThrownOrPassedThroughNext.message; 
    const errorsArray = errorThrownOrPassedThroughNext.errorsArray;
    res.status(statusCode).json({message: messagePassedViaErrorConstructor, errorsArray: errorsArray })
})
//  Multer (upload of a single image)
app.use(
    multer({storage: multerFileStorage, fileFilter: multerFileFilter}).single('image')
);
app.use(auth);
app.use(
    '/graphql', 
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true, // special tool to play around your graphql api when accessing a route on the browser only if you have a query on the model
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred!';
            const statusCode = err.originalError.statusCode || 500;
            return { message: message, statusCode: statusCode, data: data }
        }
    })
);

mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => { console.log(err)});