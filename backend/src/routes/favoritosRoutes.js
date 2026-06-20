const express = require('express');
const router = express.Router();

const { adicionarFavorito, listarFavoritos } = require('../controllers/favoritosController');
const { checkToken } = require('../middlewares/authMiddleware');

// Quando o React faz POST (clica no coração), vai para o adicionarFavorito
router.post('/', checkToken, adicionarFavorito);

// Quando o React faz GET (abre o perfil), vai para o listarFavoritos
router.get('/', checkToken, listarFavoritos);

module.exports = router;