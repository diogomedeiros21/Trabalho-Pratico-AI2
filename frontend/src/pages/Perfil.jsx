import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import { FaStar } from 'react-icons/fa';
import api from '../services/api';

function Perfil() {
  const [favoritos, setFavoritos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
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
      <div className="container mt-5 text-center text-light">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3">A abrir o teu cofre...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex align-items-center mb-5 p-4 rounded-4 shadow-sm custom-box">
        <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-4 shadow perfil-icon">
          🎮
        </div>
        <div>
          <h2 className="mb-0 fw-bold text-white">A Minha Área</h2>
          <p className="mb-0 text-soft">O teu histórico e biblioteca pessoal</p>
        </div>
      </div>

      <hr className="mb-5 hr-custom" />

      <h3 className="fw-bold mb-4 text-white">❤️ Os Meus Favoritos</h3>
      
      {favoritos.length === 0 ? (
        <div className="text-center p-5 rounded-4 border-0 mb-5 alert-custom">
          <h5 className="fw-bold text-white">Ainda não tens jogos favoritos!</h5>
          <p className="text-soft">Vai ao catálogo e clica nos corações para construíres a tua coleção.</p>
        </div>
      ) : (
        <div className="row justify-content-center g-4 mb-5">
          {favoritos.map((jogo) => (
            <div className="col-auto" key={`fav-${jogo.id}`}>
              <JogoCard jogo={jogo} favoritoInicial={true} />
            </div>
          ))}
        </div>
      )}

      <h3 className="fw-bold mb-4 text-white">⭐ As Minhas Avaliações</h3>
      
      {avaliacoes.length === 0 ? (
        <div className="text-center p-5 rounded-4 border-0 alert-custom">
          <h5 className="fw-bold text-white">Ainda não avaliaste nenhum jogo!</h5>
          <p className="text-soft">Ajuda a comunidade e deixa a tua opinião nos jogos que já conheces.</p>
        </div>
      ) : (
        <div className="row g-4">
          {avaliacoes.map((av) => (
            <div className="col-md-6" key={`av-${av.id}`}>
              <div className="d-flex p-3 rounded-4 shadow-sm h-100 align-items-center custom-box">
                <img 
                  src={av.Jogo?.imagem} 
                  alt={av.Jogo?.titulo} 
                  className="rounded-3 shadow-sm me-4 review-img"
                />
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1 text-white">{av.Jogo?.titulo}</h5>
                  <div className="text-warning mb-2 d-flex align-items-center">
                    <FaStar className="me-1 mb-1" />
                    <span className="fw-bold text-light">{av.nota}.0</span>
                  </div>
                  <p className="mb-0 fst-italic lh-sm text-soft">
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