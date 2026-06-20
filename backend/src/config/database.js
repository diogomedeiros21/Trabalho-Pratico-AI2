const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projeto_final_db', 'postgres', 'arturdiogo', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

module.exports = sequelize;