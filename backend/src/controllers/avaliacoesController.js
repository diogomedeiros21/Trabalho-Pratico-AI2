const Avaliacao = require('../models/Avaliacao');

const avaliacoesController = {};

// Função para dar uma nota a um jogo
avaliacoesController.criarAvaliacao = async (req, res) => {
  try {
    const { nota, comentario, jogoId } = req.body;
    
    // A magia da tua Fase 2: 
    // O ID do utilizador já vem extraído do Token, é super seguro!
    const userId = req.user.id; 

    // Validação básica de segurança
    if (!nota || !jogoId) {
      return res.status(400).json({ success: false, message: 'Falta a nota ou o ID do Jogo.' });
    }

    // Gravar na Base de Dados
    const novaAvaliacao = await Avaliacao.create({
      nota,
      comentario,
      jogoId,
      userId
    });

    res.status(201).json({ success: true, message: 'Avaliação enviada com sucesso!', data: novaAvaliacao });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = avaliacoesController;