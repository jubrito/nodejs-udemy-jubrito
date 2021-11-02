const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const adminRoutes = require('./routes/admin');
const morgan = require('morgan');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');
const { compress } = require('pdfkit');

const usingHeroku = true;

console.log(process.env.NODE_ENV);
const app = express();
const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clusterbackend0.luzfp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`; // process = object globally available part of the node core runtime
const store = new MongoDBStore({
    uri: CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER,
    collection: 'sessions',
    // expires
});
const csrfProtectionMiddleware = csrf();
if (!usingHeroku) {
    const privateKey = fs.readFileSync('server.key');
    const certificate = fs.readFileSync('server.cert');
}
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
        uniqueFileName = snapShotOfTheCurrentDate + '-' + fileData.originalname;
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

app.set('view engine', 'ejs');
app.set('views', 'views');
/* Helmet 
Secure node express applications: Set headers to responses following best practices */
app.use(helmet());
/* Compression
Nodejs express middleware that serves optimized assets 
*/
app.use(compression());
/* Morgan 
Simplify logging request data */
const whichDataIsBeingLoggedAndHowIsFormatted = 'combined';
const appendNewDataAtTheEndOfTheFileNotOverwriting = 'a';
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: appendNewDataAtTheEndOfTheFileNotOverwriting
});
app.use(morgan(whichDataIsBeingLoggedAndHowIsFormatted, { stream: accessLogStream }));
//  Parse incoming requests bodies (that hold data in the format of x www-form-url-encoded, a form) (PARSE TO URL ENCODED DATA) - REQUEST BODY MIDDLEWARE 
app.use(express.urlencoded({ extended: false }));
/* Statically serving a folder (requests to the files to that folder will be handled automatically and the files will be returned)
serving the public folder with the express static middleware */
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use(
    multer({
        storage: multerFileStorage, 
        fileFilter: multerFileFilter
    }).single('image')
);
// session middleware to be used for every incoming request.
app.use(expressSession({
    secret: 'this text will be used for signing the hash which secretly stores our ID in the cookie.',
    resave: false, // session will only be saved when the session changes, it won't be saved on every request done on every response sent
    saveUninitialized: false, // ensure that no session gets saved for a request where it doesn't need to be saved because nothing was cahnged about it
    store: store,
    // cookie: {maxAge}
}))

app.use(csrfProtectionMiddleware);

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next(); // this middleware will only run if the user is logged in
    }
    User
    .findById(req.session.user._id)
    .then(mongooseModelUser => {
        if (!mongooseModelUser) {
            return next();
        }
        // use that session data to load our real user, to create our mongoose user model 
        req.user = mongooseModelUser;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
})

app.use('/admin', adminRoutes); 
app.use(productRoutes); 
app.use(shopRoutes); 
app.use(authRoutes); 
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    res
        .status(500)
        .render('500_internal-error', {
            pageTitle: 'Error!',
            path: '/500',
            isAuthenticated: req.session.isAuthenticated
        });
});

mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER+'?retryWrites=true&w=majority')
    .then(connectionResult => {
        !usingHeroku 
        ? https.createServer({ key: privateKey, cert: certificate }, app)
        : app
        .listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    });

