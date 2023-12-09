const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Category = require('./Category');
const User = require('./User');

const Product = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
Product.belongsTo(Category);
Product.belongsTo(User);

module.exports = Product;
