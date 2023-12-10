const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Category = require('./Category');
const Product = require('./Product');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    shop: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.hasMany(Category, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;