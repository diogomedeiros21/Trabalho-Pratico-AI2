const Jogo = require('../models/Jogo');
const Categoria = require('../models/Categoria');
const Avaliacao = require('../models/Avaliacao'); // 1. Trazemos o modelo das Avaliações

// FUNÇÃO AUXILIAR: A nossa calculadora de serviço
const calcularMedia = (avaliacoes) => {
  // Se não houver avaliações, a nota é 0.0
  if (!avaliacoes || avaliacoes.length === 0) return "0.0";
  
  // Soma todas as notas
  const soma = avaliacoes.reduce((total, avaliacao) => total + Number(avaliacao.nota), 0);
  
  // Divide pelo número de avaliações
  const media = soma / avaliacoes.length;
  
  // Devolve o número com apenas 1 casa decimal (ex: 4.5)
  return media.toFixed(1);
};


// 2. Listar todos os jogos
const listarJogos = async (req, res) => {
  try {
    // Pede os Jogos e traz as Categorias e as Avaliações "à boleia"
    const jogos = await Jogo.findAll({ 
      include: [
        { model: Categoria },
        { model: Avaliacao }
      ] 
    });

    // Formata cada jogo para adicionar a nota média final
    const jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      // O Sequelize às vezes usa o plural em inglês, verificamos os dois nomes possíveis
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


// 3. O VERDADEIRO Top da Semana
const listarTopSemana = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({
      include: [
        { model: Categoria },
        { model: Avaliacao }
      ]
    });

    const jogosFormatados = jogos.map(jogo => {
      const jogoJSON = jogo.toJSON();
      const listaAvaliacoes = jogoJSON.Avaliacoes || jogoJSON.Avaliacaos || [];
      jogoJSON.notaMedia = calcularMedia(listaAvaliacoes);
      return jogoJSON;
    });

    // Ordenar do maior para o menor com base na nota média calculada
    jogosFormatados.sort((a, b) => parseFloat(b.notaMedia) - parseFloat(a.notaMedia));

    // Devolvemos apenas os 3 melhores
    res.json(jogosFormatados.slice(0, 3));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao procurar o Top da Semana' });
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


// Eliminar um jogo
const eliminarJogo = async (req, res) => {
  try {
    const { id } = req.params;
    await Jogo.destroy({ where: { id } });
    res.json({ mensagem: 'Jogo eliminado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao eliminar jogo' });
  }
};

module.exports = { listarJogos, listarTopSemana, criarJogo, eliminarJogo };