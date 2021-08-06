const mysql = require('mysql2');


const hostOrIpAddresss = 'localhost';
const schemaCreatedOnMySql = 'nodejs_udemy';
const rootUsername = 'root';
const rootPassword = 'passwordICreatedForMysql';

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