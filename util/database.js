const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionStringFromMongodbWebsiteCluster = 'mongodb+srv://juliana:juju2009@clusterbackend0.luzfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
    MongoClient
        .connect(connectionStringFromMongodbWebsiteCluster)
        .then(clientObjectWhichGivesAccessToTheDatabase => {
            console.log('connected!');
            callback(clientObjectWhichGivesAccessToTheDatabase);
        })
        .catch(err => console.log(err));
}

module.exports = mongoConnect;