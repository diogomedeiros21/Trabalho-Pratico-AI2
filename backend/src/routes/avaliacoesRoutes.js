const express = require('express');
const router = express.Router();
const { criarAvaliacao, listarMinhasAvaliacoes } = require('../controllers/avaliacoesController');
const { checkToken } = require('../middlewares/authMiddleware'); 

// Quando avalia um jogo
router.post('/', checkToken, criarAvaliacao);

// Quando abre a página de perfil
router.get('/', checkToken, listarMinhasAvaliacoes);

module.exports = router;