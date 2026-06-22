const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela onde guarda comentários e as notas que os utilizadores dão aos jogos
const Avaliacao = sequelize.define('Avaliacao', {
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    validate: {
      min: 1,
      max: 5 
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true 
  }
});

module.exports = Avaliacao;