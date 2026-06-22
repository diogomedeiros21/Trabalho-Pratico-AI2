const jwt = require('jsonwebtoken');

// Função para verificar se o utilizador enviou um Token válido
const checkToken = (req, res, next) => {
  // Vai buscar o cabeçalho de autorização onde o token costuma vir
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    // Se o pedido vier sem token, bloqueia o acesso imediatamente
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'chave_secreta_super_segura';
    
    // Tenta decifrar o token usando a chave secreta do servidor
    const decoded = jwt.verify(token, secret);
    
    // Se for válido, guarda os dados do utilizador (id e role) no req.user para serem usados nas rotas seguintes
    req.user = decoded; 
    
    next(); 
  } catch (error) {
    // Se o token for inválido ou se já tiverem passado as 24 horas (expirado), dá erro
    res.status(403).json({ success: false, message: 'Token inválido ou expirado.' });
  }
};

// Função para garantir que a rota só é acedida por administradores
const isAdmin = (req, res, next) => {
  // Verifica se não há utilizador logado ou se o role for diferente de 'admin'
  if (!req.user || req.user.role !== 'admin') {
    // Bloqueia o acesso a quem não for administrador
    return res.status(403).json({ success: false, message: 'Acesso negado. Exclusivo para administradores.' });
  }
  next();
};

module.exports = { checkToken, isAdmin };