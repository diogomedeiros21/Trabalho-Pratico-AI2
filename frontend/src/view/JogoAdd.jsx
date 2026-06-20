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
    api.get('/categorias') // Substituído axios pelo api
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

    api.post('/jogos/create', dados)
      .then(res => {
        if (res.data.success) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Jogo adicionado ao catálogo com sucesso!',
            icon: 'success',
            confirmButtonText: 'Fantástico'
          }).then(() => {
            navigate('/jogos/list'); // Só muda de página depois de o utilizador fechar o alerta
          });
        }
      })
      .catch(erro => {
        Swal.fire('Erro!', 'Erro ao gravar o jogo. Confirma se tens permissões.', 'error');
      });
  

  return (
    <div className="container py-4">
      <h2>Adicionar Novo Jogo</h2>
      <form onSubmit={guardarJogo} className="mt-4">
        
        <div className="mb-3">
          <label className="form-label">Título do Jogo</label>
          <input 
            type="text" 
            className="form-control" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea 
            className="form-control" 
            rows="3" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">URL da Imagem</label>
          <input 
            type="text" 
            className="form-control" 
            value={imagem} 
            onChange={(e) => setImagem(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <select 
            className="form-select" 
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

        <button type="submit" className="btn btn-primary me-2">Gravar Jogo</button>
        <Link to="/jogos/list" className="btn btn-secondary">Cancelar</Link>
      </form>
    </div>
  );
  }
}