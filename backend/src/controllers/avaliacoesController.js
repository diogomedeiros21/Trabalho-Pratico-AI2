const Avaliacao = require('../models/Avaliacao');
const Jogo = require('../models/Jogo'); 

// Quando alguém clica em "Enviar Avaliação" num jogo
const criarAvaliacao = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { jogoId, nota, comentario } = req.body;

    // Verifica se esta pessoa já avaliou este jogo antes
    const avaliacaoExistente = await Avaliacao.findOne({
      where: { userId: userId, jogoId: jogoId }
    });

    if (avaliacaoExistente) {
      // Se já avaliou, apenas atualiza a nota e o texto novo
      avaliacaoExistente.nota = nota;
      avaliacaoExistente.comentario = comentario;
      await avaliacaoExistente.save();
      return res.status(200).json({ success: true, message: 'Avaliação atualizada com sucesso!' });
    } else {
      // Se for a primeira vez, cria uma avaliação nova
      await Avaliacao.create({ userId, jogoId, nota, comentario });
      return res.status(201).json({ success: true, message: 'Avaliação enviada com sucesso!' });
    }
  } catch (erro) {
    console.error("Erro ao avaliar:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar a avaliação.' });
  }
};

// Vai buscar o histórico de comentários do próprio utilizador
const listarMinhasAvaliacoes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const avaliacoes = await Avaliacao.findAll({
      where: { userId: userId },
      include: [{ 
        model: Jogo, 
        attributes: ['titulo', 'imagem'] 
      }],
      order: [['createdAt', 'DESC']] 
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