import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function JogoCard({ jogo, favoritoInicial = false }) {
  const [isFavorito, setIsFavorito] = useState(favoritoInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

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
      Swal.fire({
        title: 'Atenção!',
        text: 'Precisas de fazer Login para adicionar aos favoritos!',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleAvaliar = async (e) => {
    e.preventDefault(); 
    try {
      const resposta = await api.post('/avaliacoes', {
        nota: Number(nota),
        comentario: comentario,
        jogoId: jogo.id
      });
      
      if (resposta.data.success || resposta.status === 201) {
        Swal.fire({
          title: 'Obrigado!',
          text: 'Avaliação enviada com sucesso!',
          icon: 'success',
          confirmButtonText: 'Fechar'
        });
        setMostrarModal(false); 
        setComentario(''); 
      }
    } catch (erro) {
      Swal.fire({
        title: 'Erro!',
        text: erro.response?.data?.message || "Precisas de fazer Login para avaliar!",
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  return (
    <>
      {/* Adicionei 'card-hover-effect' para o efeito de popup */}
      <div className="card h-100 border-0 shadow-sm card-hover-effect" style={{ width: '280px', backgroundColor: '#1e293b' }}>
        <Link to={`/jogo/${jogo.id}`}>
          <div style={{ height: '220px', overflow: 'hidden' }}>
            <img 
              src={jogo.imagem} 
              className="card-img-top" 
              alt={jogo.titulo} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', // ISSO VAI CORTAR AS BORDAS EM VEZ DE ESTICAR
                objectPosition: 'center'
              }} 
            />
          </div>
        </Link>
        
        <div className="card-body d-flex flex-column p-4">
          <Link to={`/jogo/${jogo.id}`} className="text-decoration-none text-white">
            <h5 className="card-title fw-bold mb-2 text-truncate">{jogo.titulo}</h5>
          </Link>
          
          <span className="badge align-self-start mb-4 px-3 py-2" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
            {jogo.Categoria?.nome || jogo.categoria?.nome || "Sem Categoria"}
          </span>
          
          <div className="mt-auto d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <div 
                className="d-flex align-items-center text-warning" 
                style={{ cursor: 'pointer' }}
                onClick={() => setMostrarModal(true)}
              >
                <FaStar size={20} />
                <span className="text-light ms-2 fw-bold">
                  {jogo.notaMedia || "0.0"}
                </span>
              </div>

              <button 
                onClick={handleFavoritoClick} 
                className="btn p-0 border-0"
                style={{ color: isFavorito ? '#ef4444' : '#64748b', background: 'transparent' }}
              >
                {isFavorito ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>
            
            <Link to={`/jogo/${jogo.id}`} className="btn btn-warning w-100 fw-bold text-dark mt-2 shadow-sm">
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>

      {/* Modal permanece igual... */}
      {mostrarModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Avaliar: {jogo.titulo}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleAvaliar}>
                  <div className="mb-3">
                    <label className="form-label">Que nota dás a este jogo?</label>
                    <select className="form-select bg-dark text-white border-0" value={nota} onChange={(e) => setNota(e.target.value)}>
                      <option value="5">⭐⭐⭐⭐⭐ (5) - Muito Bom</option>
                      <option value="4">⭐⭐⭐⭐ (4) - Bom</option>
                      <option value="3">⭐⭐⭐ (3) - Razoável</option>
                      <option value="2">⭐⭐ (2) - Fraco</option>
                      <option value="1">⭐ (1) - Péssimo</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">O teu comentário</label>
                    <textarea className="form-control bg-dark text-white border-0" rows="3" placeholder="Escreve aqui..." value={comentario} onChange={(e) => setComentario(e.target.value)} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold">Enviar Avaliação</button>
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