import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // Verifica se existe Token e qual a role do utilizador
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Vamos ler a role que guardaste no login

  const handleLogout = () => {
    // Apaga tudo o que é da sessão
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // MUITO IMPORTANTE: apagar a role também!
    
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
              {/* Esta parte só aparece se for Admin */}
              {userRole === 'admin' && (
                <Link className="text-warning text-decoration-none fw-bold" to="/admin/criar">
                  + Adicionar Jogo
                </Link>
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