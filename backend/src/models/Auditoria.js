const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auditoria = sequelize.define('Auditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  acao: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  detalhes: {
    type: DataTypes.TEXT, 
    allowNull: true
  }
}, {
  tableName: 'Auditoria'
});

module.exports = Auditoria;