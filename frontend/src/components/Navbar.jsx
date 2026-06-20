import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // Verifica se existe um Token guardado no cofre do navegador
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // 1. Apaga o Token (destrói a sessão)
    localStorage.removeItem('token');
    
    // 2. Manda o utilizador de volta para o Login e força a página a atualizar
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar navbar-dark bg-dark py-3">
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* Lado Esquerdo: Logotipo */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          🎮 JogoAvalia
        </Link>
        
        {/* Lado Direito: Links e Botões */}
        <div className="d-flex align-items-center gap-3">
          <Link className="text-light text-decoration-none" to="/">Catálogo</Link>
          
          {isAuthenticated ? (
            // O que aparece SE ESTIVER LOGADO (Perfil + Sair):
            <>
              <Link className="text-light text-decoration-none fw-semibold" to="/perfil">O Meu Perfil</Link>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm fw-bold">
                Sair
              </button>
            </>
          ) : (
            // O que aparece SE NÃO ESTIVER LOGADO (Entrar + Registar):
            <>
              <Link className="text-light text-decoration-none" to="/login">Entrar</Link>
              <Link className="btn btn-outline-light btn-sm" to="/register">Registar</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;