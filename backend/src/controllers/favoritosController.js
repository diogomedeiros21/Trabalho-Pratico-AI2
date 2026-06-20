const Favorito = require('../models/Favorito');
const Jogo = require('../models/Jogo');
const User = require('../models/User');
const Avaliacao = require('../models/Avaliacao');

// Adicionar ou Remover dos Favoritos 
const adicionarFavorito = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { jogoId } = req.body;

    // Procura se o jogo já está nos favoritos
    const favoritoExistente = await Favorito.findOne({
      where: { userId, jogoId }
    });

    if (favoritoExistente) {
      // Se já lá está, remove
      await favoritoExistente.destroy();
      return res.json({ success: true, message: 'Removido dos favoritos.' });
    } else {
      // Se não está, guarda
      await Favorito.create({ userId, jogoId });
      return res.status(201).json({ success: true, message: 'Adicionado aos favoritos!' });
    }
  } catch (erro) {
    console.error("Erro no favorito:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar favorito.' });
  }
};

// Listar Favoritos com cálculo de média
const listarFavoritos = async (req, res) => {
  try {
    const userId = req.user.id; 

    const utilizador = await User.findByPk(userId, {
      include: {
        model: Jogo,
        through: { attributes: [] }
      }
    });

    if (!utilizador) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    }

    // Calculamos a nota para cada jogo favorito
    const favoritosComNota = await Promise.all(utilizador.Jogos.map(async (jogo) => {
      const avaliacoes = await Avaliacao.findAll({ where: { jogoId: jogo.id } });
      
      const total = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
      const media = avaliacoes.length > 0 ? (total / avaliacoes.length).toFixed(1) : "0.0";

      return {
        ...jogo.toJSON(),
        notaMedia: media
      };
    }));

    res.json({ success: true, favoritos: favoritosComNota });

  } catch (erro) {
    console.error("Erro ao buscar favoritos:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar o cofre.' });
  }
};

// EXPORTAÇÃO CORRETA (Isto resolve o teu erro de 'undefined')
module.exports = {
  adicionarFavorito,
  listarFavoritos
};