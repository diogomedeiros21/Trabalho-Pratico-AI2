import { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import api from '../services/api'; // Importamos a autoestrada que acabaste de criar!

function JogoCard({ jogo }) {
  const [isFavorito, setIsFavorito] = useState(false);

  const handleFavoritoClick = async () => {
    try {
      // 1. Envia o pedido POST para o teu backend
      const resposta = await api.post('/favoritos', { jogoId: jogo.id });
      
      // 2. Se o backend responder com sucesso, mudamos o coração no ecrã
      if (resposta.data.success) {
        setIsFavorito(!isFavorito);
        console.log(resposta.data.message); // Vai imprimir: "Jogo adicionado/removido dos favoritos"
      }
    } catch (erro) {
      console.error("Erro ao adicionar favorito:", erro.response?.data?.message || erro.message);
      alert("Precisas de fazer Login para adicionar aos favoritos!");
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 bg-light" style={{ width: '18rem' }}>
      <img 
        src={jogo.imagem || "https://via.placeholder.com/300x200?text=Capa+do+Jogo"} 
        className="card-img-top rounded-top" 
        alt="Capa do jogo" 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-truncate">{jogo.nome}</h5>
        <span className="badge bg-secondary mb-3 w-50">{jogo.categoria}</span>
        
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-warning">
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
  );
}

export default JogoCard;