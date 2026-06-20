const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/authAdmin');
const { criarJogo, eliminarJogo } = require('../controllers/jogoController');

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
router.post('/', checkAdmin, criarJogo);
router.delete('/:id', checkAdmin, eliminarJogo);


module.exports = router;