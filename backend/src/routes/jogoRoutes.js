const express = require('express');
const router = express.Router();

// Importamos a nova função listarTopSemana
const { listarJogos, listarTopSemana, criarJogo, eliminarJogo } = require('../controllers/jogoController');

// A NOSSA NOVA ROTA (Tem de ficar acima do CRUD normal)
router.get('/top', listarTopSemana);

// Rotas originais do Medeiros
router.get('/', listarJogos);
router.post('/', criarJogo);
router.delete('/:id', eliminarJogo);

module.exports = router;