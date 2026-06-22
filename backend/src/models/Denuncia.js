const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Denuncia = sequelize.define('Denuncia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pendente'
  }
}, {
  tableName: 'Denuncias'
});

module.exports = Denuncia;