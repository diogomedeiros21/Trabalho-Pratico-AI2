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
    e.preventDefault();
    setErro('');
    try {
      const resposta = await api.post('/auth/register', { nome, email, password });
      if (resposta.data.success || resposta.status === 201) {
        navigate('/login'); 
      }
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar conta. Tenta novamente.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      {/* Adicionado bg-dark e border-secondary para integrar no Dark Mode */}
      <div className="card p-4 shadow-sm border-secondary" style={{ backgroundColor: '#1e293b' }}>
        <h3 className="mb-4 fw-bold text-center text-white">Criar Conta</h3>
        
        {erro && <div className="alert alert-danger py-2">{erro}</div>}

        <form onSubmit={handleRegisterSubmit}>
          <div className="mb-3">
            <label className="form-label text-start d-block text-white">Nome Completo</label>
            <input 
              type="text" 
              className="form-control" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start d-block text-white">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-start d-block text-white">Password</label>
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
          {/* Mudado para text-light para garantir visibilidade */}
          <span className="text-light">Já tens conta? </span>
          {/* Adicionado cor de destaque (ex: text-warning) para o link ficar visível */}
          <Link to="/login" className="text-decoration-none text-warning fw-bold">Inicia sessão aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;