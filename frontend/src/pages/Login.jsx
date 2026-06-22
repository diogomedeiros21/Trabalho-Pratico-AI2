import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await api.post('/auth/login', { email, password });

      // Se a resposta for positiva, guarda o Token e o cargo do user
      if (resposta.data.success || resposta.data.token) {
        localStorage.setItem('token', resposta.data.token); 
        localStorage.setItem('role', resposta.data.role); // Identifica se é admin ou user comum
        
        // Redireciona para a página principal
        window.location.href = '/';
      }
    } catch (err) {
      // Se algo correr mal, mostra a mensagem de erro 
      setErro(err.response?.data?.message || 'Erro ao efetuar login. Tenta novamente.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow-sm border-0">
        <h3 className="mb-4 fw-bold text-center">Entrar</h3>
        
        {/* Mostra mensagem de erro se a autenticação falhar */}
        {erro && <div className="alert alert-danger py-2">{erro}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">E-mail</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Palavra-passe</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold mt-2">
            Iniciar Sessão
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;