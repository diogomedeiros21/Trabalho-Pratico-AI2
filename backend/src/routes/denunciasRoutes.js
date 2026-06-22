const express = require('express');
const router = express.Router();
const { checkToken, isAdmin } = require('../middlewares/authMiddleware');
const { criarDenuncia, listarDenuncias, resolverDenuncia } = require('../controllers/denunciaController');

// Qualquer user logado pode denunciar
router.post('/', checkToken, criarDenuncia);

// Apenas admins podem ver a lista e resolver
router.get('/pendentes', checkToken, isAdmin, listarDenuncias);
router.post('/resolver/:id', checkToken, isAdmin, resolverDenuncia);

module.exports = router;