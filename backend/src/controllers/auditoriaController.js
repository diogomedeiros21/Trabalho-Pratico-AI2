const Auditoria = require('../models/Auditoria');
const User = require('../models/User');

// Função invisível para nos outros ficheiros para gravar quem fez o quê
const registarLog = async (userId, acao, detalhes) => {
  try {
    if (!userId) return; 
    await Auditoria.create({ userId, acao, detalhes }); 
  } catch (erro) {
    console.error("Erro ao gravar log de auditoria:", erro);
  }
};

// Vai buscar todo o histórico 
const listarLogs = async (req, res) => {
  try {
    const logs = await Auditoria.findAll({
      include: [{ model: User, as: 'Admin', attributes: ['nome', 'email'] }], 
      order: [['createdAt', 'DESC']] 
    });
    res.json({ success: true, data: logs });
  } catch (erro) {
    console.error("Erro ao listar logs:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar auditoria.' });
  }
};

module.exports = { registarLog, listarLogs };