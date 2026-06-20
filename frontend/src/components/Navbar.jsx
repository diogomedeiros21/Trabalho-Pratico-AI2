import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // Verifica se existe um Token guardado no cofre do navegador
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Apaga o Token (destrói a sessão)
    localStorage.removeItem('token');
    
    // Manda o utilizador de volta para o Login e força a página a atualizar
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar navbar-dark bg-dark py-3">
      <div className="container d-flex justify-content-between align-items-center">
        
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          🎮 MundoGaming
        </Link>
        
        <div className="d-flex align-items-center gap-3">
          <Link className="text-light text-decoration-none" to="/">Catálogo</Link>
          
          {isAuthenticated ? (
            <>
              <Link className="text-light text-decoration-none fw-semibold" to="/perfil">O Meu Perfil</Link>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm fw-bold">
                Sair
              </button>
            </>
          ) : (
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