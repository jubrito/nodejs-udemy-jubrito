const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const modelName = 'orderItem';
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
const OrderItem = sequelize.define(
    modelName,
    modelStructure
)

module.exports = OrderItem;