const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Liga à base de dados do Medeiros

const Avaliacao = sequelize.define('Avaliacao', {
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5 // Isto garante que ninguém consegue dar notas absurdas, apenas de 1 a 5!
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true // É opcional, porque o utilizador pode querer deixar só a nota sem escrever nada
  }
});

module.exports = Avaliacao;