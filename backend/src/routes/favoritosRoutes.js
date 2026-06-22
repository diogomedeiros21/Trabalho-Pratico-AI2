const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/authMiddleware'); 
const { adicionarFavorito, listarFavoritos } = require('../controllers/favoritosController'); 

router.post('/', checkToken, adicionarFavorito);
router.get('/', checkToken, listarFavoritos);

module.exports = router;