const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const modelName = 'cart';
const modelStructure = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}

const Cart = sequelize.define(
    modelName,
    modelStructure
);

module.exports = Cart;