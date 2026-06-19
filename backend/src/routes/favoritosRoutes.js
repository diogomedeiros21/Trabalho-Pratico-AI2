const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Rota protegida: Clica no coraçãozinho para adicionar ou remover
router.post('/', authMiddleware.checkToken, favoritosController.adicionarOuRemover);

module.exports = router;