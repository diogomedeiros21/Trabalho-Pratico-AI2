const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

// Tabela principal que guarda toda a informação técnica sobre os jogos do catálogo
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
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  anoLancamento: { 
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  rating: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Jogos'
});

module.exports = Jogo;