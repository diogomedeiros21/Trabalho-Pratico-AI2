const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela de ligação que guarda que utilizador gostou de que jogo
const Favorito = sequelize.define('Favorito', {
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