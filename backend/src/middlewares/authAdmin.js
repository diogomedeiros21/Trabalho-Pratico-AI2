const checkAdmin = (req, res, next) => {
  // Supõe que o teu auth middleware já colocou o utilizador em req.user
  if (req.user && req.user.role === 'admin') {
    next(); // Pode passar
  } else {
    res.status(403).json({ mensagem: "Acesso negado: Requer privilégios de Administrador" });
  }
};

module.exports = checkAdmin;