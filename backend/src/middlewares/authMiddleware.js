const jwt = require('jsonwebtoken');

// Verifica se o utilizador tem um Token válido
const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'chave_secreta_super_segura';
    // Se o token for válido, extrai a informação lá de dentro 
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    
    next(); 
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};

// Verifica além de logado, é Administrador
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acesso negado. Exclusivo para administradores.' });
  }
  next(); 
};

module.exports = { checkToken, isAdmin };