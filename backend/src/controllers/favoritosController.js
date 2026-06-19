const Favorito = require('../models/Favorito');

const favoritosController = {};

favoritosController.adicionarOuRemover = async (req, res) => {
  try {
    const { jogoId } = req.body;
    const userId = req.user.id; // O ID do utilizador vem do Token de segurança

    if (!jogoId) {
      return res.status(400).json({ success: false, message: 'Falta o ID do Jogo.' });
    }

    // Procura se este utilizador já adicionou este jogo aos favoritos
    const existe = await Favorito.findOne({ where: { userId, jogoId } });

    if (existe) {
      // Se já existe, o utilizador quer remover dos favoritos (Toggle)
      await existe.destroy();
      return res.status(200).json({ success: true, message: 'Jogo removido dos favoritos.' });
    }

    // Se não existe, cria um novo favorito
    await Favorito.create({ userId, jogoId });
    res.status(201).json({ success: true, message: 'Jogo adicionado aos favoritos com sucesso!' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = favoritosController;