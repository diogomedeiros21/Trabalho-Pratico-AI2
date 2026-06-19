const Categoria = require('../models/Categoria');

// Listar todas as categorias
const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao procurar categorias' });
  }
};

// Criar uma nova categoria
const criarCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    const novaCategoria = await Categoria.create({ nome });
    res.status(201).json(novaCategoria);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar categoria' });
  }
};

module.exports = { listarCategorias, criarCategoria };