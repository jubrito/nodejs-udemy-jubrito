const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const username = 'jubrito';
const password = 'mongoDbPassword';
const databaseIWantToConnect = 'shop';
const connectionStringFromMongodbWebsiteCluster = `mongodb+srv://${username}:${password}@clusterbackend0.luzfp.mongodb.net/${databaseIWantToConnect}?retryWrites=true&w=majority`;
let _storedConnectionWithDatabase; // underscore signs that this will only be used internally in this file

// manage one connection in our database and then simply return access to the client (database.js);
const manageDatabaseConnectionAndReturnClientAccessViaMongodb = (callback) => {
    MongoClient
        .connect(connectionStringFromMongodbWebsiteCluster)
        .then(clientObjectWhichGivesAccessToTheDatabase => {
            console.log('connected!');
            _storedConnectionWithDatabase = clientObjectWhichGivesAccessToTheDatabase.db(); // give access to the databaseIWantToConnect (you can pass a new database to connect as parameter and as string)
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDatabaseInstanceWeConnectedTo = () => {
    if (_storedConnectionWithDatabase) {
        return _storedConnectionWithDatabase;
    }
    throw 'No database found';
}

exports.mongoConnect = manageDatabaseConnectionAndReturnClientAccessViaMongodb;
exports.getDb = getDatabaseInstanceWeConnectedTo;