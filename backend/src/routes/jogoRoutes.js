const express = require('express');
const router = express.Router();

// Importa os middlewares de segurança
const { checkToken, isAdmin } = require('../middlewares/authMiddleware');

// Importa as funções com os nomes exatos do teu controller
const { 
  listarJogos, 
  listarTopSemana, // <-- Nome corrigido aqui para bater certo com o export
  obterJogo, 
  criarJogo, 
  atualizarJogo,
  eliminarJogo 
} = require('../controllers/jogoController');

// Rotas lidas pelo Frontend
router.get('/top-semana', listarTopSemana); // <-- Atualizado aqui também
router.get('/list', listarJogos);
router.get('/get/:id', obterJogo);

// Rotas protegidas para Administração
router.post('/create', checkToken, isAdmin, criarJogo);
router.post('/update/:id', checkToken, isAdmin, atualizarJogo);
router.post('/delete/:id', checkToken, isAdmin, eliminarJogo);

module.exports = router;