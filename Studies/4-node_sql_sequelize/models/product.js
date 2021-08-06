const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const modelName = 'product';
const modelStructure = {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        allowNull: false
    },
    title: Sequelize.STRING, // shortcut for only defining the type
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
}
const Product = sequelize.define(
    modelName,
    modelStructure
);

module.exports = Product;