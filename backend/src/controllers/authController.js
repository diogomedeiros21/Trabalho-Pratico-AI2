const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {};

// Quando alguém tenta criar uma conta nova
authController.register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // ve se o email já está a ser usado
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Este email já está registado.' });
    }

    // Se estiver tudo bem, cria a conta 
    const newUser = await User.create({ nome, email, password });
    res.status(201).json({ success: true, message: 'Conta criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Quando alguém tenta entrar na conta
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Procura na base de dados se o email existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    }

    // Vê se a password que escreveu bate certo com a que está guardada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password incorreta.' });
    }

    // Cria um token para ele poder andar pelo site durante 24 horas
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'chave_secreta_super_segura', 
      { expiresIn: '24h' }
    );

    // Manda o token e os dados dele para o Frontend
    res.json({ success: true, token, role: user.role, nome: user.nome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = authController;