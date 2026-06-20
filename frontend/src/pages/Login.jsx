import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o utilizador após o login
import api from '../services/api'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setErro('');

    try {
      // Envia os dados para a rota de autenticação do backend
      const resposta = await api.post('/auth/login', { email, password });

      // Se o backend responder com sucesso e trouxer o token
      if (resposta.data.success || resposta.data.token) {
        // Guarda o token no cofre do navegador (localStorage)
        localStorage.setItem('token', resposta.data.token);
        
        // NOVO: Guarda a role que vem do backend
        localStorage.setItem('role', resposta.data.role);
        
        console.log('Login efetuado com sucesso! Token e role guardados.');
        
        // Redireciona e força a página a atualizar para a Navbar detetar o Token instantaneamente
        window.location.href = '/';
      }
    } catch (err) {
      // Captura o erro do backend 
      setErro(err.response?.data?.message || 'Erro ao efetuar login. Tenta novamente.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow-sm border-0">
        <h3 className="mb-4 fw-bold text-center">Entrar</h3>
        
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