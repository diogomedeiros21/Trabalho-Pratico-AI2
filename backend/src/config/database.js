const { Sequelize } = require('sequelize');

// Ligação a uma base de dados local SQLite (perfeito para testares o teu código agora)
// Mais tarde, o Medeiros pode mudar isto para o link do PostgreSQL do Render
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './banco_de_dados_local.sqlite',
  logging: false // Esconde os comandos de SQL no terminal para não o poluir
});

module.exports = sequelize;