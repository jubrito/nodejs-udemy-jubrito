const mysql = require('mysql2');


const hostOrIpAddresss = 'localhost';
const schemaCreatedOnMySql = 'nodejs_udemy';
const rootUsername = 'root';
const rootPassword = 'juju2009';
/* WITHOUT SEQUELIZE 
const connectionPool = mysql.createPool({
    host: hostOrIpAddresss,
    user: rootUsername
    database: schemaCreatedOnMySql,
    password: rootPassword
});

// Promice chains: use promises when working with these connections which 
// handle asynchronous tasks, asynchronous data instead of many nested callbacks 
// because promises allow us to write code in a bit more structured way
module.exports = connectionPool.promise(); 
*/

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    schemaCreatedOnMySql,
    rootUsername,
    rootPassword,
    {
        dialect: 'mysql',
        host: hostOrIpAddresss
    }
)

module.exports = sequelize;