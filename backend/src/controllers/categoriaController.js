const Categoria = require('../models/Categoria');

// Devolve a lista de todas as categorias para preencher os menus no site
const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao procurar categorias' });
  }
};

// Permite criar uma categoria nova 
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