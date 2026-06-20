const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');

// Importa middleware
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/', authMiddleware.checkToken, avaliacoesController.criarAvaliacao);

module.exports = router;