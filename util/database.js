const mysql = require('mysql2');

const hostOrIpAddresss = 'localhost';
const schemaCreatedOnMySql = 'nodejs_udemy';
const connectionPool = mysql.createPool({
    host: hostOrIpAddresss,
    user: 'root',
    database: schemaCreatedOnMySql,
    password: 'juju2009'
});

/* Promice chains: use promises when working with these connections which 
handle asynchronous tasks, asynchronous data instead of many nested callbacks 
because promises allow us to write code in a bit more structured way*/
module.exports = connectionPool.promise(); 