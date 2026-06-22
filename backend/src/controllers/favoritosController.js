const Favorito = require('../models/Favorito');
const Jogo = require('../models/Jogo');
const User = require('../models/User');
const Avaliacao = require('../models/Avaliacao');
const Categoria = require('../models/Categoria'); 

// Quando alguém clica no coração de um jogo
const adicionarFavorito = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { jogoId } = req.body;

    // Vai ver se o utilizador já tem este jogo guardado na lista dele
    const favoritoExistente = await Favorito.findOne({
      where: { userId, jogoId }
    });

    if (favoritoExistente) {
      // Se já lá estiver, apaga 
      await favoritoExistente.destroy();
      return res.json({ success: true, message: 'Removido dos favoritos.' });
    } else {
      // Se não estiver, adiciona à lista
      await Favorito.create({ userId, jogoId });
      return res.status(201).json({ success: true, message: 'Adicionado aos favoritos!' });
    }
  } catch (erro) {
    console.error("Erro no favorito:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar favorito.' });
  }
};

// Vai buscar todos os jogos que a pessoa guardou
const listarFavoritos = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Vai buscar o utilizador e pede os jogos todos que ele adicionou
    const utilizador = await User.findByPk(userId, {
      include: {
        model: Jogo,
        through: { attributes: [] },
        include: [{ model: Categoria, as: 'Categoria' }]
      }
    });

    if (!utilizador) {
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
    }

    // Faz as contas para saber a nota média de cada jogo que está nos favoritos
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

module.exports = {
  adicionarFavorito,
  listarFavoritos
};