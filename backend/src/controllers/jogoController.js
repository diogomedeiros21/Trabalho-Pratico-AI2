const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao');

<<<<<<< HEAD
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
    const jogo = await Jogo.findAll({ 
        where: { id: id }, 
        include: [Categoria] 
    });
    res.json({ success: true, data: jogo });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao obter jogo' });
  }
};

// Novo jogo
=======
// FUNÇÃO AUXILIAR: Calcular média
const calcularMedia = (avaliacoes) => {
  if (!avaliacoes || avaliacoes.length === 0) return "0.0";
  const soma = avaliacoes.reduce((total, avaliacao) => total + Number(avaliacao.nota), 0);
  const media = soma / avaliacoes.length;
  return media.toFixed(1);
};

// 1. Listar todos os jogos
const listarJogos = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({ 
      include: [{ model: Categoria }, { model: Avaliacao }] 
    });

    const jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || []; 
      jogoJSON.notaMedia = calcularMedia(listaAvaliacoes);
      return jogoJSON;
    });

    res.json(jogosFormatados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao procurar jogos' });
  }
};

// 2. O Top da Semana
const listarTopSemana = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({
      include: [{ model: Categoria }, { model: Avaliacao }]
    });

    const jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || [];
      jogoJSON.notaMedia = calcularMedia(listaAvaliacoes);
      return jogoJSON;
    });

    jogosFormatados.sort((a, b) => parseFloat(b.notaMedia) - parseFloat(a.notaMedia));
    res.json(jogosFormatados.slice(0, 3));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao procurar o Top da Semana' });
  }
};

// 3. A NOVA FUNÇÃO: Obter apenas um jogo pelo ID
const obterJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await Jogo.findByPk(id, {
      include: [{ model: Categoria }, { model: Avaliacao }]
    });

    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    const jogoJSON = jogo.toJSON();
    const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || [];
    jogoJSON.notaMedia = calcularMedia(listaAvaliacoes);

    res.json(jogoJSON);
  } catch (erro) {
    console.error("Erro ao buscar detalhes do jogo:", erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar o jogo' });
  }
};

// 4. Criar um novo jogo
>>>>>>> c39f7f7dcc475e7f85674a23d61bfdfddb903a63
const criarJogo = async (req, res) => {
  try {
    const { titulo, descricao, imagem, categoriaId } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId });
    res.status(201).json({ success: true, data: novoJogo, message: "Jogo criado!" });
  } catch (erro) {
    res.status(500).json({ success: false, message: 'Erro ao criar jogo' });
  }
};

<<<<<<< HEAD
// Editar dados de um jogo
const atualizarJogo = async (req, res) => {
=======
// 5. Eliminar um jogo
const eliminarJogo = async (req, res) => {
>>>>>>> c39f7f7dcc475e7f85674a23d61bfdfddb903a63
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

<<<<<<< HEAD
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
=======
// AQUI ESTAVA O PROBLEMA: Garantir que a função 'obterJogo' é exportada!
module.exports = { listarJogos, listarTopSemana, obterJogo, criarJogo, eliminarJogo };
>>>>>>> c39f7f7dcc475e7f85674a23d61bfdfddb903a63
