const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const USERNAME_MONGODB = 'juliana';
const PASSWORD_MONGODB = 'ar6tE3vMlcpFT4OW';
const DATABASE_I_WANT_TO_CONNECT = 'messages';
const CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER = `mongodb+srv://${USERNAME_MONGODB}:${PASSWORD_MONGODB}@clusterbackend0.luzfp.mongodb.net/${DATABASE_I_WANT_TO_CONNECT}`;

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers
}));

/* Test in postmand  
GET http://localhost:8080/graphql
Body -> Raw (JSON)
{
    "query": "{ hello { text } }"
}
*/

mongoose
    .connect(CONNECTION_STRING_FROM_MONGODB_WEBSITE_CLUSTER)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => { console.log(err)});