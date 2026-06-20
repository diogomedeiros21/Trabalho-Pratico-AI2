const express = require('express');
const router = express.Router();

// 1. Uma única linha a importar TODAS as funções do controlador
const { 
  listarJogos, 
  listarTopSemana, 
  obterJogo, 
  criarJogo, 
  eliminarJogo 
} = require('../controllers/jogoController');

// 2. As tuas Rotas
router.get('/top', listarTopSemana); // O Top (tem de ficar acima do /:id)
router.get('/:id', obterJogo);       // A nossa ROTA NOVA para os detalhes
router.get('/', listarJogos);        // Catálogo normal
router.post('/', criarJogo);         // Criar jogo
router.delete('/:id', eliminarJogo); // Eliminar jogo

module.exports = router;