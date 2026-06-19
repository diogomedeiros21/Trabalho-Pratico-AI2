const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');

// Listar todos os jogos (trazendo também a categoria deles)
const listarJogos = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({ include: Categoria });
    res.json(jogos);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao procurar jogos' });
  }
};

// Criar um novo jogo
const criarJogo = async (req, res) => {
  try {
    const { titulo, descricao, imagem, categoriaId } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId });
    res.status(201).json(novoJogo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar jogo' });
  }
};

// Eliminar um jogo pelo ID
const eliminarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    await Jogo.destroy({ where: { id } });
    res.json({ mensagem: 'Jogo eliminado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao eliminar jogo' });
  }
};

module.exports = { listarJogos, criarJogo, eliminarJogo };