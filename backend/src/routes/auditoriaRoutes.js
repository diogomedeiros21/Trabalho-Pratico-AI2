const express = require('express');
const router = express.Router();
const { checkToken, isAdmin } = require('../middlewares/authMiddleware');
const { listarLogs } = require('../controllers/auditoriaController');

// Apenas admins podem ler
router.get('/list', checkToken, isAdmin, listarLogs);

module.exports = router;