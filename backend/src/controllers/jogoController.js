const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao');
const User = require('../models/User');
const Favorito = require('../models/Favorito');

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
      // ADICIONADO O "as" AQUI
      include: [{ model: Categoria, as: 'Categoria' }, { model: Avaliacao }] 
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
      // ADICIONADO O "as" AQUI
      include: [{ model: Categoria, as: 'Categoria' }, { model: Avaliacao }]
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

// 3. Obter apenas um jogo pelo ID
const obterJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await Jogo.findByPk(id, {
      include: [
        { model: Categoria, as: 'Categoria' }, 
        { 
          model: Avaliacao,
          include: [{ model: User, attributes: ['nome'] }] // trazer o nome do user
        }
      ]
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
    // Adicionamos o anoLancamento e rating ao req.body
    const { titulo, descricao, imagem, categoriaId, anoLancamento, rating } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId, anoLancamento, rating });
    res.status(201).json(novoJogo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar jogo' });
  }
};

// 4.5. Atualizar um jogo existente
const atualizarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    // Adicionamos o anoLancamento e rating ao req.body
    const { titulo, descricao, imagem, categoriaId, anoLancamento, rating } = req.body;

    const jogo = await Jogo.findByPk(id);
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    // Atualizamos a linha na base de dados com tudo
    await jogo.update({ titulo, descricao, imagem, categoriaId, anoLancamento, rating });
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

// 6. Gerar Rankings Dinâmicos
const obterRankings = async (req, res) => {
  try {
    const { tipo } = req.params; 

    // Vai buscar os jogos todos e as respetivas avaliações
    const jogos = await Jogo.findAll({
      include: [{ model: Categoria, as: 'Categoria' }, { model: Avaliacao }]
    });

    // Vai buscar os favoritos todos para podermos contar
    const todosFavoritos = await Favorito.findAll();

    // Calcula os pontos de cada jogo
    let jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || [];

      jogoJSON.notaMedia = parseFloat(calcularMedia(listaAvaliacoes));
      jogoJSON.totalComentarios = listaAvaliacoes.length;
      // Conta quantas vezes este ID de jogo aparece na tabela de Favoritos
      jogoJSON.totalFavoritos = todosFavoritos.filter(fav => fav.jogoId === jogo.id).length; 

      return jogoJSON;
    });

    // Ordena a lista dependendo do botão que o utilizador clicou
    if (tipo === 'avaliados') {
      jogosFormatados.sort((a, b) => b.notaMedia - a.notaMedia);
    } else if (tipo === 'populares') {
      jogosFormatados.sort((a, b) => b.totalFavoritos - a.totalFavoritos);
    } else if (tipo === 'comentados') {
      jogosFormatados.sort((a, b) => b.totalComentarios - a.totalComentarios);
    }

    // Devolve apenas os 3 primeiros
    res.json({ success: true, data: jogosFormatados.slice(0, 3) });
  } catch (erro) {
    console.error("Erro nos rankings:", erro);
    res.status(500).json({ success: false, message: 'Erro ao gerar rankings' });
  }
};

module.exports = { listarJogos, listarTopSemana, obterJogo, criarJogo, atualizarJogo, eliminarJogo, obterRankings };