const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Product = require('./Product');

const Category = sequelize.define('categories', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});
Category.hasMany(Product);

module.exports = Category;
