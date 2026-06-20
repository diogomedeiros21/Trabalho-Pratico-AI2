import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function JogoEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Carregar as categorias para a dropdown
    axios.get('http://localhost:3000/categorias')
      .then(res => setCategorias(res.data))
      .catch(erro => console.error("Erro categorias:", erro));

    // Carregar os dados do jogo específico
    axios.get(`http://localhost:3000/jogos/get/${id}`)
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
          // Vai buscar a posição [0] porque o backend usa findAll
          const jogo = res.data.data[0]; 
          setTitulo(jogo.titulo);
          setDescricao(jogo.descricao || '');
          setImagem(jogo.imagem || '');
          setCategoriaId(jogo.categoriaId || '');
        }
      })
      .catch(erro => {
        console.error("Erro ao carregar o jogo:", erro);
      });
  }, [id]);

  const atualizarJogo = (e) => {
    e.preventDefault();
    
    const dados = { titulo, descricao, imagem, categoriaId };

    axios.post(`http://localhost:3000/jogos/update/${id}`, dados)
      .then(res => {
        if (res.data.success) {
          alert(res.data.message); // Vai mostrar "Atualizado com sucesso" 
          navigate('/jogos/list');
        }
      })
      .catch(erro => {
        alert("Erro ao atualizar o jogo: " + erro);
      });
  };

  return (
    <div className="container py-4">
      <h2>Editar Jogo (ID: {id})</h2>
      <form onSubmit={atualizarJogo} className="mt-4">
        
        <div className="mb-3">
          <label className="form-label">Título do Jogo</label>
          <input type="text" className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea className="form-control" rows="3" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">URL da Imagem</label>
          <input type="text" className="form-control" value={imagem} onChange={(e) => setImagem(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="">Selecione uma categoria...</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-warning me-2">Guardar Alterações</button>
        <Link to="/jogos/list" className="btn btn-secondary">Cancelar</Link>
      </form>
    </div>
  );
}