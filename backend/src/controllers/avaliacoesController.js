const Avaliacao = require('../models/Avaliacao');

// Criar ou Atualizar a Avaliação
const criarAvaliacao = async (req, res) => {
  try {
    // Quem está a avaliar e o que está a avaliar
    const userId = req.user.id;
    const { jogoId, nota, comentario } = req.body;

    // Procura na base de dados se já existe uma avaliação deste utilizador para este jogo
    const avaliacaoExistente = await Avaliacao.findOne({
      where: { userId: userId, jogoId: jogoId }
    });

    if (avaliacaoExistente) {
      // Se a avaliação já existe, edita os valores e guarda
      avaliacaoExistente.nota = nota;
      avaliacaoExistente.comentario = comentario;
      await avaliacaoExistente.save();

      return res.status(200).json({ 
        success: true, 
        message: 'Avaliação atualizada com sucesso!' 
      });
    } else {
      // Se não existe, cria um registo novo
      const novaAvaliacao = await Avaliacao.create({
        userId,
        jogoId,
        nota,
        comentario
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Avaliação enviada com sucesso!' 
      });
    }
  } catch (erro) {
    console.error("Erro ao avaliar:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar a avaliação.' });
  }
};

module.exports = {
  criarAvaliacao
};