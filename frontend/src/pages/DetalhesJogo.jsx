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

  if (carregando) return <div className="container mt-5 text-center text-light"><div className="spinner-border text-warning"></div></div>;
  if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
  if (!jogo) return <div className="container mt-5 alert alert-warning">Jogo não encontrado.</div>;

  const avaliacoes = jogo.Avaliacoes || jogo.Avaliacaos || [];

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-light mb-4">← Voltar ao Catálogo</Link>
      
      <div className="row p-4 p-md-5 rounded-4 shadow-sm custom-box">
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img 
            src={jogo.imagem} 
            alt={jogo.titulo} 
            className="img-fluid rounded-4 shadow detalhes-img" 
          />
        </div>

        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-white">{jogo.titulo}</h1>
            <span className="badge px-3 py-2 badge-category">{jogo.Categoria?.nome || 'Sem Categoria'}</span>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {jogo.anoLancamento && (
              <span className="badge py-2 px-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-soft)', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                Ano: {jogo.anoLancamento}
              </span>
            )}
            {jogo.rating && (
              <span className="badge py-2 px-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-soft)', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                Rating: {jogo.rating} / 10
              </span>
            )}
          </div>
          
          <h4 className="text-warning fw-bold mb-4 d-flex align-items-center">
            <FaStar className="mb-1 me-2" /> {jogo.notaMedia || "0.0"} / 5.0 
            <span className="ms-2 fs-6 fw-normal" style={{ color: 'var(--text-soft)' }}>(Comunidade)</span>
          </h4>

          <h5 className="fw-bold text-white">Sobre o jogo:</h5>
          <p className="mb-4 text-lh-large text-soft">
            {jogo.descricao || "Nenhuma descrição disponível para este jogo."}
          </p>

          <hr className="my-4 hr-custom" />

          <h5 className="fw-bold mb-3 text-white">O que a comunidade diz:</h5>
          
          {avaliacoes.length === 0 ? (
            <p className="fst-italic text-soft">Ainda não há comentários. Sê o primeiro a avaliar!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-3 rounded-3 comment-box">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-warning">
                      {av.User?.nome || av.user?.nome || 'Utilizador'}
                    </span>
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