const express = require('express');
const router = express.Router();

// Importação correta: Certifica-te que todos estes nomes estão dentro das chavetas {}
const { 
  listarJogos, 
  listarTopSemana, 
  obterJogo, 
  criarJogo, 
  eliminarJogo 
} = require('../controllers/jogoController');

// Rotas
router.get('/top', listarTopSemana);
router.get('/:id', obterJogo);
router.get('/', listarJogos);
router.post('/', criarJogo);
router.delete('/:id', eliminarJogo);

module.exports = router;