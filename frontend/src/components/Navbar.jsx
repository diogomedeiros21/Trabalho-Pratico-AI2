import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar navbar-dark bg-dark py-1">
      <div className="container d-flex justify-content-between align-items-center">
        
        <Link className="navbar-brand fw-bold text-white fs-4 d-flex align-items-center" to="/">
          <img src="/logo.png" alt="MundoGaming Logo" className="navbar-logo" />
          MundoGaming
        </Link>
        
        <div className="d-flex align-items-center gap-3">
          <Link className="text-light text-decoration-none" to="/">Catálogo</Link>
          
          {isAuthenticated ? (
            <>
              {userRole === 'admin' && (
                <>
                  <Link className="text-warning text-decoration-none fw-bold" to="/moderacao">
                    Moderação
                  </Link>
                  <Link className="text-warning text-decoration-none fw-bold" to="/jogos/list">
                    Gerir Jogos
                  </Link>
                  <Link className="text-warning text-decoration-none fw-bold" to="/jogos/add">
                    Adicionar Jogo
                  </Link>
                </>
              )}

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