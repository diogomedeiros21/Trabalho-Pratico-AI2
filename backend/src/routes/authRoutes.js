const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas Livres (Não precisam do middleware checkToken porque ainda não têm conta/não entraram)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;