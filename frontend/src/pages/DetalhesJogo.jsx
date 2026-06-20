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
        // Rota corrigida
        const resposta = await api.get(`/jogos/get/${id}`);
        // Como o teu backend usa findAll por ID, ele devolve um array na posição data.data[0]
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

  if (carregando) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (erro) return <div className="container mt-5 alert alert-danger">{erro}</div>;
  if (!jogo) return <div className="container mt-5 alert alert-warning">Jogo não encontrado.</div>;

  const avaliacoes = jogo.Avaliacoes || jogo.Avaliacaos || [];

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">← Voltar ao Catálogo</Link>
      
      <div className="row bg-white p-4 rounded-4 shadow-sm border">
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img 
            src={jogo.imagem} 
            alt={jogo.titulo} 
            className="img-fluid rounded shadow" 
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h1 className="fw-bold mb-0">{jogo.titulo}</h1>
            <span className="badge bg-secondary fs-6">{jogo.Categoria?.nome || 'Sem Categoria'}</span>
          </div>
          
          <h4 className="text-warning fw-bold mb-4">
            <FaStar className="mb-1 me-1" /> {jogo.notaMedia || "0.0"} / 5.0
          </h4>

          <h5 className="fw-bold text-dark">Sobre o jogo:</h5>
          <p className="text-muted" style={{ lineHeight: '1.6' }}>
            {jogo.descricao || "Nenhuma descrição disponível para este jogo."}
          </p>

          <hr className="my-4" />

          <h5 className="fw-bold mb-3">O que a comunidade diz:</h5>
          
          {avaliacoes.length === 0 ? (
            <p className="text-muted fst-italic">Ainda não há comentários. Sê o primeiro a avaliar!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {avaliacoes.map((av) => (
                <div key={av.id} className="bg-light p-3 rounded border">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-primary">Avaliação de Utilizador</span>
                    <span className="text-warning fw-bold"><FaStar className="mb-1"/> {av.nota}.0</span>
                  </div>
                  <p className="mb-0 text-dark">{av.comentario}</p>
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