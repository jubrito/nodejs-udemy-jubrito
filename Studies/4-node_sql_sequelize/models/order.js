const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const modelName = 'order';
const modelStructure = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}

const Order = sequelize.define(
    modelName,
    modelStructure
);

module.exports = Order;