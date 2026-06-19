const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
  // Vamos forçar a criação destas colunas provisoriamente
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jogoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dataAdicao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Favorito;