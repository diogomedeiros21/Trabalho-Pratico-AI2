const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');

// Importamos o teu segurança (middleware) da Fase 2
const authMiddleware = require('../middlewares/authMiddleware'); 

// Rota protegida: Só quem tem o Token (fez login) pode criar uma avaliação
// Nota: dependendo de como chamaste a função no authMiddleware, pode ser authMiddleware.checkToken ou authMiddleware.verifyToken
router.post('/', authMiddleware.checkToken, avaliacoesController.criarAvaliacao);

module.exports = router;