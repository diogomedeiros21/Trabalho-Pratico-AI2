const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
  // O Sequelize vai injetar o ID do Utilizador e o ID do Jogo aqui automaticamente!
  dataAdicao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Regista automaticamente a data e hora em que o jogo foi favoritado
  }
});

module.exports = Favorito;