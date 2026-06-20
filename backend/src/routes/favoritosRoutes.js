const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/authMiddleware'); 
const { adicionarFavorito, listarFavoritos } = require('../controllers/favoritosController'); 
console.log("--- DEBUG DE ROTAS ---");
console.log("checkToken:", checkToken);
console.log("adicionarFavorito:", adicionarFavorito);
console.log("listarFavoritos:", listarFavoritos);
console.log("----------------------");

// Quando o React faz POST (clica no coração), vai para o adicionarFavorito
console.log("DEBUG: adicionarFavorito é:", adicionarFavorito);
console.log("DEBUG: checkToken é:", checkToken);
router.post('/', checkToken, adicionarFavorito); // <-- O erro deve estar aqui ou na linha anterior
// Quando o React faz GET (abre o perfil), vai para o listarFavoritos
router.get('/', checkToken, listarFavoritos);

module.exports = router;