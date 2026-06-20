import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import { FaStar } from 'react-icons/fa'; // Importamos a estrela!
import api from '../services/api';

function Perfil() {
  const [favoritos, setFavoritos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]); // Novo estado para guardar as reviews
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Agora fazemos dois pedidos ao mesmo tempo: Favoritos e Avaliações
        const [respostaFavs, respostaAvs] = await Promise.all([
          api.get('/favoritos'),
          api.get('/avaliacoes')
        ]);

        setFavoritos(respostaFavs.data.favoritos || respostaFavs.data || []);
        setAvaliacoes(respostaAvs.data.avaliacoes || respostaAvs.data || []);
        
        setCarregando(false);
      } catch (erro) {
        console.error("Erro ao carregar dados do perfil:", erro);
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  if (carregando) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="mt-2 fw-semibold">A abrir o teu cofre...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {/* Cabeçalho do Perfil */}
      <div className="d-flex align-items-center mb-4 p-4 bg-white rounded shadow-sm border">
        <div 
          className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-4 shadow" 
          style={{ width: '70px', height: '70px', fontSize: '30px' }}
        >
          🎮
        </div>
        <div>
          <h2 className="mb-0 fw-bold text-dark">A Minha Área</h2>
          <p className="text-muted mb-0 fs-5">O teu histórico e biblioteca pessoal</p>
        </div>
      </div>

      <hr className="mb-5" />

      {/* --- SECÇÃO: FAVORITOS --- */}
      <h3 className="fw-bold mb-4">❤️ Os Meus Favoritos</h3>
      
      {favoritos.length === 0 ? (
        <div className="alert alert-secondary text-center shadow-sm p-4 border-0 mb-5">
          <h5 className="fw-bold">Ainda não tens jogos favoritos!</h5>
          <p className="mb-0">Vai ao catálogo e clica nos corações para construíres a tua coleção.</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {favoritos.map((jogo) => (
            <div className="col-md-4" key={`fav-${jogo.id}`}>
              <JogoCard jogo={jogo} favoritoInicial={true} />
            </div>
          ))}
        </div>
      )}

      {/* --- SECÇÃO: AVALIAÇÕES --- */}
      <h3 className="fw-bold mb-4">⭐ As Minhas Avaliações</h3>
      
      {avaliacoes.length === 0 ? (
        <div className="alert alert-secondary text-center shadow-sm p-4 border-0">
          <h5 className="fw-bold">Ainda não avaliaste nenhum jogo!</h5>
          <p className="mb-0">Ajuda a comunidade e deixa a tua opinião nos jogos que já conheces.</p>
        </div>
      ) : (
        <div className="row g-4">
          {avaliacoes.map((av) => (
            <div className="col-md-6" key={`av-${av.id}`}>
              <div className="d-flex bg-white p-3 rounded-4 shadow-sm border h-100 align-items-center">
                
                {/* Imagem pequenina do jogo */}
                <img 
                  src={av.Jogo?.imagem} 
                  alt={av.Jogo?.titulo} 
                  className="rounded-3 shadow-sm me-4"
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                />
                
                {/* Texto da avaliação */}
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1 text-dark">{av.Jogo?.titulo}</h5>
                  <div className="text-warning mb-2 d-flex align-items-center">
                    <FaStar className="me-1 mb-1" />
                    <span className="fw-bold text-dark">{av.nota}.0</span>
                  </div>
                  <p className="mb-0 text-muted fst-italic lh-sm">
                    "{av.comentario}"
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Perfil;