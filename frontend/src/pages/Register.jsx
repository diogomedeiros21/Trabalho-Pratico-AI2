import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tentar registo com:', { nome, email, password });
    // Futuramente: axios.post('/register', { nome, email, password })...
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Criar Conta</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="O teu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required 
                  />
                </div>

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
                
                <button type="submit" className="btn btn-success w-100 fw-bold">
                  Registar
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Já tens conta? <Link to="/login" className="text-decoration-none">Inicia sessão aqui</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}