const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const modelName = 'user'
const modelStructure = {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
}
const User = sequelize.define(
    modelName,
    modelStructure
);

module.exports= User;