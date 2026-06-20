import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); // Impede que a página faça "refresh" e perca os dados
    setErro('');

    try {
      // Envia os dados para a tua rota de registo no backend
      const resposta = await api.post('/auth/register', { nome, email, password });

      if (resposta.data.success || resposta.status === 201) {
        console.log('Conta criada com sucesso!');
        // Manda o utilizador diretamente para a página de Login para entrar
        navigate('/login'); 
      }
    } catch (err) {
      // Se houver erro, mostra na página
      setErro(err.response?.data?.message || 'Erro ao criar conta. Tenta novamente.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <div className="card p-4 shadow-sm border-0">
        <h3 className="mb-4 fw-bold text-center">Criar Conta</h3>
        
        {/* Mostra a mensagem de erro a vermelho caso falhe */}
        {erro && <div className="alert alert-danger py-2">{erro}</div>}

        <form onSubmit={handleRegisterSubmit}>
          <div className="mb-3">
            <label className="form-label text-start d-block">Nome Completo</label>
            <input 
              type="text" 
              className="form-control" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start d-block">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-start d-block">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            Registar
          </button>
        </form>

        <div className="mt-3 text-center">
          <span className="text-muted">Já tens conta? </span>
          <Link to="/login" className="text-decoration-none">Inicia sessão aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;