const express = require('express');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
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
app.use(function addHeadersToEveryRequestMiddleware (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // all domains should be able to access our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // origins can use http methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // clients can send requests that hold extra authorization data on the header and defines the content type of the request
    next();
})
// Statically serving images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Error Handling Middleware
app.use((errorThrownOrPassedThroughNext, req, res, next) => {
    console.log(errorThrownOrPassedThroughNext);
    const statusCode = errorThrownOrPassedThroughNext.statusCode || 500;
    const messagePassedViaErrorConstructor = errorThrownOrPassedThroughNext.message; 
    const errorsArray = error.errorsArray;
    res.status(statusCode).json({message: messagePassedViaErrorConstructor, errorsArray: errorsArray })
})
//  Multer (upload of a single image)
app.use(
    multer({storage: multerFileStorage, fileFilter: multerFileFilter}).single('image')
);
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => { console.log(err)});