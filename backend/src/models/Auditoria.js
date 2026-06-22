const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define a tabela que vai guardar o histórico das ações dos administradores
const Auditoria = sequelize.define('Auditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  acao: {
    type: DataTypes.STRING, // Guarda o nome da ação
    allowNull: false 
  },
  detalhes: {
    type: DataTypes.TEXT, // Guarda o texto a explicar o que aconteceu
    allowNull: true 
  }
}, {
  tableName: 'Auditoria'
});

module.exports = Auditoria;