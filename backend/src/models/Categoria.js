const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define a tabela das Categorias (ex: Ação, RPG, Desporto)
const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  }
}, {
  tableName: 'Categorias',
  timestamps: false 
});

module.exports = Categoria;