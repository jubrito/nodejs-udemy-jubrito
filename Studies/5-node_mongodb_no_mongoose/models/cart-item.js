const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const modelName = 'cartItem';
const modelStructure = {
    id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    quantity: {
        allowNull: false,
        type: Sequelize. INTEGER
    }
}
const CartItem = sequelize.define(
    modelName,
    modelStructure
)

module.exports = CartItem;