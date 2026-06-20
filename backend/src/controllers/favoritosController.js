const Favorito = require('../models/Favorito');
const Jogo = require('../models/Jogo');
const User = require('../models/User');

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
      // Se já lá está, o clique serve para remover 
      await favoritoExistente.destroy();
      return res.json({ success: true, message: 'Removido dos favoritos.' });
    } else {
      // Se não está, guarda na base de dados (Dar Like)
      await Favorito.create({ userId, jogoId });
      return res.status(201).json({ success: true, message: 'Adicionado aos favoritos!' });
    }
  } catch (erro) {
    console.error("Erro no favorito:", erro);
    res.status(500).json({ success: false, message: 'Erro interno ao guardar favorito.' });
  }
};

// Listar Favoritos 
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

    res.json({ success: true, favoritos: utilizador.Jogos || [] });

  } catch (erro) {
    console.error("Erro ao buscar favoritos:", erro);
    res.status(500).json({ success: false, message: 'Erro ao carregar o cofre.' });
  }
};

module.exports = {
  adicionarFavorito,
  listarFavoritos
};