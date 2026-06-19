const jwt = require('jsonwebtoken');

// 1. Segurança Principal: Verifica se o utilizador tem um Token válido
const checkToken = (req, res, next) => {
  // O token vem no cabeçalho no formato "Bearer asdasdasd.123123..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'chave_secreta_super_segura';
    // Se o token for válido, extraímos a informação lá de dentro (id, role)
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    
    next(); // Está limpo, pode entrar na rota!
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};

// 2. Segurança de Elite: Verifica se além de logado, é Administrador
const isAdmin = (req, res, next) => {
  // Atenção: Esta verificação só corre DEPOIS do checkToken
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acesso negado. Exclusivo para administradores.' });
  }
  next(); // É admin, pode passar!
};

module.exports = { checkToken, isAdmin };