import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function JogoEdit() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

useEffect(() => {
    // 1. Carregar categorias
    api.get('/categorias')
      .then(res => {
        if (res.data.success) {
          setCategorias(res.data.data);
        } else if (Array.isArray(res.data)) {
          setCategorias(res.data);
        }
      })
      .catch(erro => console.error("Erro categorias:", erro));

    // 2. Carregar jogo (VERSÃO À PROVA DE BALA)
    // Tenta a rota normal. Se não der, tenta a rota /get/id do teu colega
    const fetchJogo = async () => {
      try {
        let resposta = await api.get(`/jogos/${id}`).catch(() => api.get(`/jogos/get/${id}`));
        
        // O JS tenta adivinhar onde o backend escondeu os dados
        let jogo = resposta.data;
        if (resposta.data.success && resposta.data.data) {
          jogo = Array.isArray(resposta.data.data) ? resposta.data.data[0] : resposta.data.data;
        } else if (Array.isArray(resposta.data)) {
          jogo = resposta.data[0];
        }

        // Preenche o formulário
        setTitulo(jogo.titulo || '');
        setDescricao(jogo.descricao || '');
        setImagem(jogo.imagem || '');
        setCategoriaId(jogo.categoriaId || '');

      } catch (erro) {
        console.error("Erro absoluto ao carregar o jogo:", erro);
        Swal.fire({
          title: 'Erro de Conexão!',
          text: 'O backend não está a enviar os dados deste jogo.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    };

    fetchJogo();
  }, [id]);

  const atualizarJogo = (e) => {
    e.preventDefault();
    const dados = { titulo, descricao, imagem, categoriaId };
    const token = localStorage.getItem('token');

    // Rota de update (confirma se no teu jogoRoutes.js é mesmo /update/:id ou só put /:id. Assumi o que tinhas antes)
    api.post(`/jogos/update/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success || res.status === 200) {
          Swal.fire({
            title: '✏️ Atualizado!',
            text: res.data.message || 'O jogo foi atualizado com sucesso.',
            icon: 'success',
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'Ok'
          }).then(() => {
            navigate('/jogos/list');
          });
        }
      })
      .catch(erro => {
        Swal.fire({
          title: 'Erro!',
          text: erro.response?.data?.message || 'Erro ao atualizar o jogo. Confirma as tuas permissões.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      });
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-lg border-0 w-100 bg-dark" style={{ maxWidth: '700px' }}>
        <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 text-center">
          <h3 className="fw-bold text-info">✏️ Editar Jogo <span className="text-light fs-5">#{id}</span></h3>
          <p className="text-light opacity-75 small">Altera os dados necessários e guarda as modificações.</p>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <form onSubmit={atualizarJogo}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-light">Título do Jogo</label>
              <input 
                type="text" 
                className="form-control" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-light">Descrição</label>
              <textarea 
                className="form-control" 
                rows="4" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-light">URL da Imagem</label>
              <input 
                type="text" 
                className="form-control" 
                value={imagem} 
                onChange={(e) => setImagem(e.target.value)} 
              />
              {imagem && (
                <div className="mt-3 text-center">
                  <img src={imagem} alt="Capa" className="img-thumbnail border-0 shadow-sm" style={{ maxHeight: '150px' }} />
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold text-light">Categoria</label>
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

            <div className="d-flex gap-3">
              <Link to="/jogos/list" className="btn btn-light w-50 fw-bold py-2">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-info w-50 fw-bold py-2 text-dark">
                Guardar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}