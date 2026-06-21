const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria'); // Importamos o modelo da Categoria

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
  },
  // 1. A COLUNA QUE FALTAVA PARA O SEQUELIZE NÃO A IGNORAR
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Jogos'
});

Jogo.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'Categoria' });
Categoria.hasMany(Jogo, { foreignKey: 'categoriaId', as: 'Jogos' });

module.exports = Jogo;