const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Product = require('./Product');

const Category = sequelize.define('categories', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Category;
