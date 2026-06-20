const express = require('express');
const router = express.Router();

// Importa o middleware de segurança (ajusta o caminho se necessário)
const { checkToken, isAdmin } = require('../middlewares/authMiddleware');

// Importa as funções do controlador numa única linha
const { 
  listarJogos, 
  listarTopSemana, 
  obterJogo, 
  criarJogo, 
  eliminarJogo 
} = require('../controllers/jogoController');

// Rotas
router.get('/top', listarTopSemana);
router.get('/:id', obterJogo);
router.get('/', listarJogos);

// Usamos o checkToken primeiro e o isAdmin depois para proteger as rotas
router.post('/', checkToken, isAdmin, criarJogo);
router.delete('/:id', checkToken, isAdmin, eliminarJogo);

module.exports = router;