const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {};

// Função de Registo
authController.register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // Verifica se o email já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Este email já está registado.' });
    }

    // Cria o novo utilizador (a password é encriptada automaticamente pelo Modelo)
    const newUser = await User.create({ nome, email, password });
    res.status(201).json({ success: true, message: 'Conta criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Função de Login
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Procura o utilizador
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    }

    // Compara a password inserida com a encriptada na base de dados
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password incorreta.' });
    }

    // Gera o Token JWT (válido por 24 horas)
    // O secret vem do ficheiro .env que o Medeiros vai configurar
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'chave_secreta_super_segura', 
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, role: user.role, nome: user.nome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = authController;