import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logotipo que leva à Home */}
        <Link className="navbar-brand fw-bold" to="/">
          🎮 JogoAvalia
        </Link>
        
        {/* Botão hambúrguer para telemóveis */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Links de navegação */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Catálogo</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Entrar</Link>
            </li>
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link className="btn btn-outline-light btn-sm px-3" to="/register">Registar</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}