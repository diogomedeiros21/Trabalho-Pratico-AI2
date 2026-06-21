import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function JogoAdd() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get('/categorias')
      .then(res => {
        if (res.data.success) {
          setCategorias(res.data.data);
        } else if (Array.isArray(res.data)) {
          setCategorias(res.data);
        }
      })
      .catch(erro => console.error("Erro ao carregar categorias:", erro));
  }, []);

  const guardarJogo = (e) => {
    e.preventDefault();
    const dados = { titulo, descricao, imagem, categoriaId };
    const token = localStorage.getItem('token');

    api.post('/jogos/create', dados, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success || res.status === 201) {
          Swal.fire({
            title: '✨ Sucesso!',
            text: 'Jogo adicionado ao catálogo com sucesso!',
            icon: 'success',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'Fantástico'
          }).then(() => {
            navigate('/jogos/list');
          });
        }
      })
      .catch(erro => {
        Swal.fire({
          title: 'Erro!',
          text: erro.response?.data?.message || 'Erro ao gravar o jogo.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      });
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0 w-100 bg-dark" style={{ maxWidth: '700px' }}>
        <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 text-center">
          <h3 className="fw-bold text-warning">✨ Adicionar Novo Jogo</h3>
          {/* Alterado para text-white */}
          <p className="text-white small">Preenche os detalhes para expandir o catálogo.</p>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <form onSubmit={guardarJogo}>
            <div className="mb-4">
              {/* Alterado para text-white */}
              <label className="form-label fw-semibold text-white">Título do Jogo</label>
              <input 
  type="text" 
  className="form-control" // Mantém apenas a classe padrão
  style={{ backgroundColor: '#ffffff', color: '#000000' }} // Forçamos branco com letra preta
  placeholder="Ex: The Witcher 3"
  value={titulo} 
  onChange={(e) => setTitulo(e.target.value)} 
  required 
/>
            </div>

            <div className="mb-4">
              {/* Alterado para text-white */}
              <label className="form-label fw-semibold text-white">Descrição</label>
<input 
  type="text" 
  className="form-control" // Mantém apenas a classe padrão
  style={{ backgroundColor: '#ffffff', color: '#000000' }} // Forçamos branco com letra preta
  placeholder="Ex: The Witcher 3"
  value={titulo} 
  onChange={(e) => setTitulo(e.target.value)} 
  required 
/>
            </div>

            <div className="mb-4">
              {/* Alterado para text-white */}
              <label className="form-label fw-semibold text-white">URL da Imagem (Capa)</label>
              <input 
  type="url" 
  className="form-control" 
  style={{ backgroundColor: '#ffffff', color: '#000000' }}
  placeholder="https://exemplo.com/imagem.jpg"
  value={imagem} 
  onChange={(e) => setImagem(e.target.value)} 
/>
              {imagem && (
                <div className="mt-3 text-center">
                  <img src={imagem} alt="Pré-visualização" className="img-thumbnail border-0 shadow-sm" style={{ maxHeight: '150px' }} />
                </div>
              )}
            </div>

            <div className="mb-5">
              {/* Alterado para text-white */}
              <label className="form-label fw-semibold text-white">Categoria</label>
              <select 
  className="form-select" 
  style={{ backgroundColor: '#ffffff', color: '#000000' }}
  value={categoriaId} 
  onChange={(e) => setCategoriaId(e.target.value)} 
  required
>
                <option value="">Selecione uma categoria...</option>
  {categorias.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.nome}</option>
  ))}
</select>
            </div>

            <div className="d-flex gap-3">
              <Link to="/jogos/list" className="btn btn-outline-light w-50 fw-bold py-2">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-warning w-50 fw-bold py-2 text-dark">
                Gravar Jogo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}