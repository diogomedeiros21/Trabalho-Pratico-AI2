const Auditoria = require('../models/Auditoria');
const User = require('../models/User');

const registarLog = async (userId, acao, detalhes) => {
  try {
    if (!userId) return;
    await Auditoria.create({ userId, acao, detalhes });
  } catch (erro) {
    console.error("Erro ao gravar log de auditoria:", erro);
  }
};

// Rota para o Admin ver tudo
const listarLogs = async (req, res) => {
  try {
    const logs = await Auditoria.findAll({
      include: [{ model: User, as: 'Admin', attributes: ['nome', 'email'] }],
      order: [['createdAt', 'DESC']] // Os mais recentes primeiro
    });
    res.json({ success: true, data: logs });
  } catch (erro) {
    console.error("Erro ao listar logs:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar auditoria.' });
  }
};

module.exports = { registarLog, listarLogs };