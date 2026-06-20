import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2'; // Importação adicionada

export default function JogoEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get('/categorias')
      .then(res => setCategorias(res.data))
      .catch(erro => console.error("Erro categorias:", erro));

    api.get(`/jogos/get/${id}`)
      .then(res => {
        if (res.data.success && res.data.data.length > 0) {
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

    api.post(`/jogos/update/${id}`, dados)
      .then(res => {
        if (res.data.success) {
          // Substituído o alert() pelo Swal.fire() com redirecionamento no final
          Swal.fire({
            title: 'Atualizado!',
            text: res.data.message || 'O jogo foi atualizado com sucesso.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            navigate('/jogos/list');
          });
        }
      })
      .catch(erro => {
        // Substituído o alert() pelo Swal.fire()
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao atualizar o jogo. Confirma as tuas permissões.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
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