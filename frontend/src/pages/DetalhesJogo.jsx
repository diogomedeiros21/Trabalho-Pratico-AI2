import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import api from '../services/api';

function DetalhesJogo() {
  const { id } = useParams(); 
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const resposta = await api.get(`/jogos/get/${id}`);
        const dadosJogo = resposta.data.data ? resposta.data.data[0] : resposta.data;
        setJogo(dadosJogo);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setErro("Não foi possível carregar os detalhes deste jogo.");
        setCarregando(false);
      }
    };

    buscarDetalhes();
  }, [id]);

  if (carregando) return <div className="container mt-5 text-center text-light"><div className="spinner-border" style={{color: 'var(--accent)'}}></div></div>;
  if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
  if (!jogo) return <div className="container mt-5 alert alert-warning">Jogo não encontrado.</div>;

  const avaliacoes = jogo.Avaliacoes || jogo.Avaliacaos || [];

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-light mb-4">← Voltar ao Catálogo</Link>
      
      {/* Container principal com o novo estilo de cartão suave */}
      <div className="row p-4 p-md-5 rounded-4 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img 
            src={jogo.imagem} 
            alt={jogo.titulo} 
            className="img-fluid rounded-4 shadow" 
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-white">{jogo.titulo}</h1>
            <span className="badge px-3 py-2">{jogo.Categoria?.nome || 'Sem Categoria'}</span>
          </div>
          
          <h4 className="text-warning fw-bold mb-4">
            <FaStar className="mb-1 me-1" /> {jogo.notaMedia || "0.0"} / 5.0
          </h4>

          <h5 className="fw-bold text-white">Sobre o jogo:</h5>
          <p className="mb-4" style={{ color: 'var(--text-soft)', lineHeight: '1.6' }}>
            {jogo.descricao || "Nenhuma descrição disponível para este jogo."}
          </p>

          <hr className="my-4 border-0" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

          <h5 className="fw-bold mb-3 text-white">O que a comunidade diz:</h5>
          
          {avaliacoes.length === 0 ? (
            <p className="fst-italic" style={{ color: 'var(--text-soft)' }}>Ainda não há comentários. Sê o primeiro a avaliar!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold" style={{ color: 'var(--accent)' }}>Avaliação de Utilizador</span>
                    <span className="text-warning fw-bold"><FaStar className="mb-1"/> {av.nota}.0</span>
                  </div>
                  <p className="mb-0 text-white">{av.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesJogo;