const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

sequelize.sync().then(() => {
  console.log('Banco de dados conectado');
}).catch((error) => {
  console.error('Erro ao conectar com o banco de dados', error);
});

module.exports = sequelize;
