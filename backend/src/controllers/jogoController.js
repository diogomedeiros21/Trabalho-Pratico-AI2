const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao');
const User = require('../models/User');
const Favorito = require('../models/Favorito');
const { registarLog } = require('./auditoriaController');

// Função auxiliar para somar as notas todas e dividir para dar a média
const calcularMedia = (avaliacoes) => {
  if (!avaliacoes || avaliacoes.length === 0) return "0.0";
  const soma = avaliacoes.reduce((total, avaliacao) => total + Number(avaliacao.nota), 0);
  const media = soma / avaliacoes.length;
  return media.toFixed(1); 
};

// Vai buscar o catálogo todo de jogos
const listarJogos = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({ 
      include: [{ model: Categoria, as: 'Categoria' }, { model: Avaliacao }] 
    });

    // Pega em cada jogo e calcula a sua média antes de enviar para o site
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

// Devolve top3
const listarTopSemana = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({
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

// Abre a página de um jogo específico e mostra os seus detalhes
const obterJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await Jogo.findByPk(id, {
      include: [
        { model: Categoria, as: 'Categoria' }, 
        { 
          model: Avaliacao,
          include: [{ model: User, attributes: ['nome'] }] 
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

// Admin cria um jogo novo
const criarJogo = async (req, res) => {
  try {
    const { titulo, descricao, imagem, categoriaId, anoLancamento, rating } = req.body;
    const novoJogo = await Jogo.create({ titulo, descricao, imagem, categoriaId, anoLancamento, rating });
    
    // Regista
    await registarLog(req.user.id, 'CRIAR_JOGO', `Adicionou o jogo: ${titulo}`);
    
    res.status(201).json(novoJogo);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar jogo' });
  }
};

// Admin edita a informação de um jogo
const atualizarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, imagem, categoriaId, anoLancamento, rating } = req.body;

    const jogo = await Jogo.findByPk(id);
    if (!jogo) {
      return res.status(404).json({ mensagem: 'Jogo não encontrado' });
    }

    await jogo.update({ titulo, descricao, imagem, categoriaId, anoLancamento, rating });
    
    // Regista
    await registarLog(req.user.id, 'EDITAR_JOGO', `Editou o jogo: ${titulo} (ID: ${id})`);
    
    res.json(jogo);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar jogo' });
  }
};

// Admin elimina um jogo 
const eliminarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    await Jogo.destroy({ where: { id } });
    
    // Regista
    await registarLog(req.user.id, 'APAGAR_JOGO', `Apagou o jogo com ID: ${id}`);
    
    res.json({ mensagem: 'Jogo eliminado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao eliminar jogo' });
  }
};

// O motor do pódio que está na página principal
const obterRankings = async (req, res) => {
  try {
    const { tipo } = req.params; 

    const jogos = await Jogo.findAll({
      include: [{ model: Categoria, as: 'Categoria' }, { model: Avaliacao }]
    });

    const todosFavoritos = await Favorito.findAll();

    let jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || [];

      jogoJSON.notaMedia = parseFloat(calcularMedia(listaAvaliacoes));
      jogoJSON.totalComentarios = listaAvaliacoes.length;
      // Vê quantas vezes este jogo apareceu na tabela de favoritos para saber os likes
      jogoJSON.totalFavoritos = todosFavoritos.filter(fav => fav.jogoId === jogo.id).length; 

      return jogoJSON;
    });

    // Ordena a lista do maior para o mais pequeno consoante a categoria
    if (tipo === 'avaliados') {
      jogosFormatados.sort((a, b) => b.notaMedia - a.notaMedia);
    } else if (tipo === 'populares') {
      jogosFormatados.sort((a, b) => b.totalFavoritos - a.totalFavoritos);
    } else if (tipo === 'comentados') {
      jogosFormatados.sort((a, b) => b.totalComentarios - a.totalComentarios);
    }

    // Só devolve ao ecrã os 3 melhores
    res.json({ success: true, data: jogosFormatados.slice(0, 3) });
  } catch (erro) {
    console.error("Erro nos rankings:", erro);
    res.status(500).json({ success: false, message: 'Erro ao gerar rankings' });
  }
};

module.exports = { listarJogos, listarTopSemana, obterJogo, criarJogo, atualizarJogo, eliminarJogo, obterRankings };