const checkAdmin = (req, res, next) => {
  // Verifica se a pessoa que está a tentar fazer isto é admin
  if (req.user && req.user.role === 'admin') {
    next(); // Se for admin, deixa o código continuar a funcionar 
  } else {
    // Se for um utilizador normal, bloqueia e avisa que não tem permissão
    res.status(403).json({ mensagem: "Acesso negado: Requer privilégios de Administrador" });
  }
};

module.exports = checkAdmin;