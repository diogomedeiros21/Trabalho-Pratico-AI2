const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define a estrutura principal dos Jogos a guardar na base de dados
const Jogo = sequelize.define('Jogo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagem: {
    type: DataTypes.STRING, 
    allowNull: true
  }
}, {
  tableName: 'Jogos'
});

module.exports = Jogo;