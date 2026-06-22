const Denuncia = require('../models/Denuncia');
const Avaliacao = require('../models/Avaliacao');
const User = require('../models/User');
const Jogo = require('../models/Jogo');

// Utilizador envia uma denúncia
const criarDenuncia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avaliacaoId, motivo } = req.body;

    // Evitar spam: verificar se este user já denunciou esta avaliação
    const jaDenunciou = await Denuncia.findOne({ where: { userId, avaliacaoId, status: 'pendente' } });
    if (jaDenunciou) {
      return res.status(400).json({ success: false, message: 'Já enviaste uma denúncia para este comentário.' });
    }

    await Denuncia.create({ userId, avaliacaoId, motivo });
    res.status(201).json({ success: true, message: 'Denúncia registada. A nossa equipa vai analisar.' });
  } catch (erro) {
    console.error("Erro ao criar denúncia:", erro);
    res.status(500).json({ success: false, message: 'Erro ao enviar denúncia.' });
  }
};

// Admin vê todas as denúncias pendentes
const listarDenuncias = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      where: { status: 'pendente' },
      include: [
        { model: User, as: 'Denunciador', attributes: ['nome', 'email'] },
        { 
          model: Avaliacao, 
          include: [
            { model: User, attributes: ['nome'] }, 
            { model: Jogo, attributes: ['titulo', 'imagem'] }
          ]
        }
      ],
      order: [['createdAt', 'ASC']] 
    });

    res.json({ success: true, denuncias });
  } catch (erro) {
    console.error("Erro ao listar denúncias:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar denúncias.' });
  }
};

// Admin resolve a denúncia 
const resolverDenuncia = async (req, res) => {
  try {
    const { id } = req.params;
    const { acao } = req.body;

    const denuncia = await Denuncia.findByPk(id, { include: [Avaliacao] });
    
    if (!denuncia) {
      return res.status(404).json({ success: false, message: 'Denúncia não encontrada.' });
    }

    if (acao === 'apagar') {
      if (denuncia.Avaliacao) {
        await denuncia.Avaliacao.destroy();
      }
      await Denuncia.update({ status: 'resolvida' }, { where: { avaliacaoId: denuncia.avaliacaoId } });
      
      return res.json({ success: true, message: 'Comentário apagado e denúncia resolvida.' });
    } 
    
    if (acao === 'ignorar') {
      denuncia.status = 'rejeitada';
      await denuncia.save();
      return res.json({ success: true, message: 'Denúncia ignorada.' });
    }

    res.status(400).json({ success: false, message: 'Ação inválida.' });
  } catch (erro) {
    console.error("Erro ao resolver denúncia:", erro);
    res.status(500).json({ success: false, message: 'Erro ao processar a denúncia.' });
  }
};

module.exports = { criarDenuncia, listarDenuncias, resolverDenuncia };