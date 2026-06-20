import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdicionarJogo() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    categoriaId: ''
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Enviamos o token no cabeçalho (Authorization: Bearer ...)
      await api.post('/jogos', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Jogo adicionado com sucesso!');
      navigate('/'); // Volta para a home
    } catch (err) {
      setErro('Erro ao adicionar jogo. Verifica se és admin ou se os dados estão corretos.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4 fw-bold">Adicionar Novo Jogo</h3>
        {erro && <div className="alert alert-danger">{erro}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input type="text" className="form-control" required onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea className="form-control" required onChange={(e) => setFormData({...formData, descricao: e.target.value})}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">URL da Imagem</label>
            <input type="url" className="form-control" required onChange={(e) => setFormData({...formData, imagem: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">ID da Categoria</label>
            <input type="number" className="form-control" required onChange={(e) => setFormData({...formData, categoriaId: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Guardar Jogo</button>
        </form>
      </div>
    </div>
  );
}

export default AdicionarJogo;