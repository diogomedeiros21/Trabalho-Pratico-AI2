import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  // Estados para guardar o que o utilizador escreve
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função que corre quando clicamos no botão de "Entrar"
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que a página faça refresh
    console.log('Tentar login com:', { email, password });
    // Futuramente: axios.post('/login', { email, password })...
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Iniciar Sessão</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="teuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  Entrar
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Não tens conta? <Link to="/register" className="text-decoration-none">Regista-te aqui</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}