import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function JogoAdd() {
  const navigate = useNavigate();

  // Estados para todos os campos que a tabela Jogo precisa
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // Estado para a dropdown de categorias
  const [categorias, setCategorias] = useState([]);

  // Ir buscar as categorias à rota oficial quando a página abre
  useEffect(() => {
    axios.get('http://localhost:3000/categorias')
      .then(res => {
        if (res.data.success) {
          setCategorias(res.data.data);
        } else if (Array.isArray(res.data)) {
          setCategorias(res.data);
        }
      })
      .catch(erro => console.error("Erro ao carregar categorias:", erro));
  }, []);

  // Função para enviar os dados reais para o backend
  const guardarJogo = (e) => {
    e.preventDefault();
    
    const dados = { titulo, descricao, imagem, categoriaId };

    // Usa o router.post('/create') do jogoRoutes.js
    axios.post('http://localhost:3000/jogos/create', dados)
      .then(res => {
        if (res.data.success) {
          alert("Jogo adicionado ao catálogo com sucesso!");
          navigate('/jogos/list'); // Atira de volta para a tabela
        }
      })
      .catch(erro => {
        alert("Erro ao gravar o jogo: " + erro);
      });
  };

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