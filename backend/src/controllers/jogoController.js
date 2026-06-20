const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao');

// ==========================================
// CRUD COMPLETO
// ==========================================

// Listar todos
const listarJogos = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({ include: Categoria });
    res.json({ success: true, data: jogos });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao procurar jogos' });
  }
};

// LER (Por ID): Para preencher o formulário de edição
const obterJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await Jogo.findByPk(id, { include: [Categoria] });
    
    if (!jogo) {
      return res.status(404).json({ success: false, message: 'Jogo não encontrado' });
    }
    
    res.json({ success: true, data: jogo });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao obter jogo' });
  }
};

// Novo jogo
const criarJogo = async (req, res) => {
  try {
    const { titulo, descricao, imagem, categoriaId } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId });
    res.status(201).json({ success: true, data: novoJogo, message: "Jogo criado!" });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao criar jogo' });
  }
};

// Editar dados de um jogo
const atualizarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, imagem, categoriaId } = req.body;
    const atualizado = await Jogo.update(
      { titulo, descricao, imagem, categoriaId },
      { where: { id: id } }
    );
    res.json({ success: true, data: atualizado, message: "Atualizado com sucesso" });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar' });
  }
};

// Apagar um jogo
const eliminarJogo = async (req, res) => {
  try {
    const { id } = req.params; //[cite: 8]
    await Jogo.destroy({ where: { id: id } });
    res.json({ success: true, message: 'Jogo eliminado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao eliminar jogo' });
  }
};

// ==========================================
// TOP DA SEMANA
// ==========================================
const topDaSemana = async (req, res) => {
  try {
    const topJogos = await Jogo.findAll({
      attributes: {
        // Usamos as funções matemáticas do Sequelize para calcular a média
        include: [
          [sequelize.fn('AVG', sequelize.col('Avaliacaos.nota')), 'mediaAvaliacoes'] 
        ]
      },
      include: [
        {
          model: Avaliacao,
          attributes: [], 
        },
        {
          model: Categoria,
          attributes: ['nome']
        }
      ],
      group: ['Jogo.id', 'Categoria.id'], // Obrigatório agrupar ao usar o AVG
      order: [[sequelize.col('mediaAvaliacoes'), 'DESC']], // Ordena da maior média para a menor
      limit: 5 // Traz apenas o Top 5
    });

    res.json({ success: true, data: topJogos });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ success: false, message: 'Erro ao calcular o Top da Semana' });
  }
};

module.exports = { 
    listarJogos, obterJogo, criarJogo, atualizarJogo, eliminarJogo, topDaSemana 
};
