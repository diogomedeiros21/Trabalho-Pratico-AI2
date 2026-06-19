const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // O Medeiros vai criar este ficheiro de ligação
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Não permite dois utilizadores com o mesmo email
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
    defaultValue: 'user' // Pode ser 'user' ou 'admin' (para cumprir o requisito do professor)
  }
}, {
  // Este "hook" é a magia do Bcrypt: encripta a password automaticamente ANTES de gravar na BD
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;