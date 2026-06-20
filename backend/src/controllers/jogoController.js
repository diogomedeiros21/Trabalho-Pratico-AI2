const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao');

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
const criarJogo = async (req, res) => {
  try {
    const { titulo, descricao, imagem, categoriaId } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId });
    res.status(201).json(novoJogo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar jogo' });
  }
};

// 4.5. Atualizar um jogo existente
const atualizarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, imagem, categoriaId } = req.body;

    const jogo = await Jogo.findByPk(id);
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    await jogo.update({ titulo, descricao, imagem, categoriaId });
    res.json(jogo);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar jogo' });
  }
};

// 5. Eliminar um jogo
const eliminarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    await Jogo.destroy({ where: { id } });
    res.json({ mensagem: 'Jogo eliminado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao eliminar jogo' });
  }
};

// AQUI ESTAVA O PROBLEMA: Garantir que a função 'obterJogo' é exportada!
module.exports = { listarJogos, listarTopSemana, obterJogo, criarJogo, eliminarJogo };
module.exports = { listarJogos, listarTopSemana, obterJogo, criarJogo, atualizarJogo, eliminarJogo };
