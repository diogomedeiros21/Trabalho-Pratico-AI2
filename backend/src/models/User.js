const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

// Tabela para guardar as informações das pessoas que se registam no site
const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true 
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user' 
  }
}, {
  hooks: {
    // Esta função corre automaticamente antes de gravar os dados de um novo user na base de dados
    beforeCreate: async (user) => {
      if (user.password) {
        // Encripta a password para não ficar visível em texto simples na base de dados
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;