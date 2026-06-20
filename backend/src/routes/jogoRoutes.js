const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');
const Categoria = require('../models/Categoria');

// Rotas do CRUD
router.get('/list', jogoController.listarJogos);
router.get('/get/:id', jogoController.obterJogo); 
router.post('/create', jogoController.criarJogo);
router.post('/update/:id', jogoController.atualizarJogo); 
router.post('/delete/:id', jogoController.eliminarJogo); 

// Rota Top da Semana
router.get('/top-semana', jogoController.topDaSemana);

module.exports = router;