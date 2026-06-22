const express = require('express');
const router = express.Router();

// Importa os middlewares de segurança
const { checkToken, isAdmin } = require('../middlewares/authMiddleware');

// Importa as funções com os nomes exatos do teu controller
const { 
  listarJogos, 
  listarTopSemana, 
  obterJogo, 
  criarJogo, 
  atualizarJogo,
  eliminarJogo,
  obterRankings 
} = require('../controllers/jogoController');

// Rotas lidas pelo Frontend
router.get('/top-semana', listarTopSemana); 
router.get('/list', listarJogos);
router.get('/get/:id', obterJogo);
router.get('/ranking/:tipo', obterRankings);

// Rotas protegidas para Administração
router.post('/create', checkToken, isAdmin, criarJogo);
router.post('/update/:id', checkToken, isAdmin, atualizarJogo);
router.post('/delete/:id', checkToken, isAdmin, eliminarJogo);

module.exports = router;