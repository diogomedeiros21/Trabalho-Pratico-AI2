import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import api from '../services/api';
import { Link } from 'react-router-dom';

function JogoCard({ jogo, favoritoInicial = false }) {
  const [isFavorito, setIsFavorito] = useState(favoritoInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  // Garantir que se o estado inicial mudar, o coração atualiza
  useEffect(() => {
    setIsFavorito(favoritoInicial);
  }, [favoritoInicial]);

  const handleFavoritoClick = async () => {
    try {
      const resposta = await api.post('/favoritos', { jogoId: jogo.id });
      if (resposta.data.success || resposta.status === 201 || resposta.status === 200) {
        setIsFavorito(!isFavorito);
      }
    } catch (erro) {
      alert("Precisas de fazer Login para adicionar aos favoritos!");
    }
  };

  // Função para enviar a Avaliação
  const handleAvaliar = async (e) => {
    e.preventDefault(); // Evita que a página faça refresh
    try {
      const resposta = await api.post('/avaliacoes', {
        nota: Number(nota),
        comentario: comentario,
        jogoId: jogo.id
      });
      
      if (resposta.data.success || resposta.status === 201) {
        alert("Avaliação enviada com sucesso!");
        setMostrarModal(false); // Fecha a janela
        setComentario(''); // Limpa o texto
      }
    } catch (erro) {
      alert(erro.response?.data?.message || "Precisas de fazer Login para avaliar!");
    }
  };

  return (
    <>
      {/* O Cartão do Jogo */}
      <div className="card h-100 shadow-sm border-0 bg-light" style={{ width: '18rem' }}>
        <Link to={`/jogo/${jogo.id}`}>
          <img 
           src={jogo.imagem} 
          className="card-img-top" 
          alt={jogo.titulo} 
          style={{ cursor: 'pointer', objectFit: 'cover', height: '200px' }} 
           />
          </Link>
        
        <div className="card-body d-flex flex-column">
          <Link to={`/jogo/${jogo.id}`} className="text-decoration-none text-dark">
            <h5 className="card-title fw-bold mb-1">{jogo.titulo}</h5>
          </Link>
          
          <span className="badge bg-secondary mb-3 w-50">
            {jogo.Categoria?.nome || "Shooter"}
          </span>
          
          <div className="mt-auto d-flex justify-content-between align-items-center">
            
            <div 
              className="d-flex align-items-center text-warning" 
              style={{ cursor: 'pointer' }}
              onClick={() => setMostrarModal(true)}
              title="Clica para avaliar!"
            >
              <FaStar size={20} />
              <span className="text-dark ms-2 fw-semibold">
                {jogo.notaMedia || "0.0"}
              </span>
            </div>

            <button 
              onClick={handleFavoritoClick} 
              className="btn btn-light border-0 text-danger p-1"
              style={{ background: 'transparent' }}
            >
              {isFavorito ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">Avaliar: {jogo.titulo}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              
              <div className="modal-body p-4">
                <form onSubmit={handleAvaliar}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Que nota dás a este jogo?</label>
                    <select className="form-select" value={nota} onChange={(e) => setNota(e.target.value)}>
                      <option value="5">⭐⭐⭐⭐⭐ (5) - Muito Bom</option>
                      <option value="4">⭐⭐⭐⭐ (4) - Bom</option>
                      <option value="3">⭐⭐⭐ (3) - Razoável</option>
                      <option value="2">⭐⭐ (2) - Fraco</option>
                      <option value="1">⭐ (1) - Péssimo</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">O teu comentário</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Escreve aqui a tua opinião..."
                      value={comentario} 
                      onChange={(e) => setComentario(e.target.value)} 
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-warning w-100 fw-bold">
                    Enviar Avaliação
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JogoCard;