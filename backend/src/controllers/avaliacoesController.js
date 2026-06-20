const Avaliacao = require('../models/Avaliacao');
const Jogo = require('../models/Jogo'); // Precisamos disto para ir buscar o nome e imagem do jogo avaliado

// Criar ou Atualizar a Avaliação (A tua função original)
const criarAvaliacao = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jogoId, nota, comentario } = req.body;

    const avaliacaoExistente = await Avaliacao.findOne({
      where: { userId: userId, jogoId: jogoId }
    });

    if (avaliacaoExistente) {
      avaliacaoExistente.nota = nota;
      avaliacaoExistente.comentario = comentario;
      await avaliacaoExistente.save();
      return res.status(200).json({ success: true, message: 'Avaliação atualizada com sucesso!' });
    } else {
      await Avaliacao.create({ userId, jogoId, nota, comentario });
      return res.status(201).json({ success: true, message: 'Avaliação enviada com sucesso!' });
    }
  } catch (erro) {
    console.error("Erro ao avaliar:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar a avaliação.' });
  }
};

// NOVA FUNÇÃO: Buscar as avaliações do próprio utilizador
const listarMinhasAvaliacoes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const avaliacoes = await Avaliacao.findAll({
      where: { userId: userId },
      include: [{ 
        model: Jogo, 
        attributes: ['titulo', 'imagem'] // Trazemos o título e a imagem para ficar bonito no Frontend
      }],
      order: [['createdAt', 'DESC']] // Ordena da mais recente para a mais antiga
    });

    res.json({ success: true, avaliacoes });
  } catch (erro) {
    console.error("Erro ao buscar avaliações do utilizador:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar o teu histórico.' });
  }
};

module.exports = {
  criarAvaliacao,
  listarMinhasAvaliacoes
};