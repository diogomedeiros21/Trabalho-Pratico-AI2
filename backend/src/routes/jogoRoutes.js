const express = require('express');
const router = express.Router();
const { listarJogos, criarJogo, eliminarJogo } = require('../controllers/jogoController');

router.get('/', listarJogos);
router.post('/', criarJogo);
router.delete('/:id', eliminarJogo);

module.exports = router;