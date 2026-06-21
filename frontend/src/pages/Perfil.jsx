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
        <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status"></div>
        <p className="mt-3">A abrir o teu cofre...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {/* Cabeçalho do Perfil - Fundo escuro e elegante */}
      <div className="d-flex align-items-center mb-5 p-4 rounded-4 shadow-sm border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div 
          className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-4 shadow" 
          style={{ width: '70px', height: '70px', fontSize: '30px' }}
        >
          🎮
        </div>
        <div>
          <h2 className="mb-0 fw-bold text-white">A Minha Área</h2>
          <p className="mb-0" style={{ color: 'var(--text-soft)' }}>O teu histórico e biblioteca pessoal</p>
        </div>
      </div>

      <hr className="mb-5 border-0" style={{ height: '1px', backgroundColor: 'var(--card-bg)' }} />

      {/* --- SECÇÃO: FAVORITOS --- */}
      <h3 className="fw-bold mb-4 text-white">❤️ Os Meus Favoritos</h3>
      
      {favoritos.length === 0 ? (
        <div className="text-center p-5 rounded-4 border-0 mb-5" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h5 className="fw-bold text-white">Ainda não tens jogos favoritos!</h5>
          <p style={{ color: 'var(--text-soft)' }}>Vai ao catálogo e clica nos corações para construíres a tua coleção.</p>
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

      {/* --- SECÇÃO: AVALIAÇÕES --- */}
      <h3 className="fw-bold mb-4 text-white">⭐ As Minhas Avaliações</h3>
      
      {avaliacoes.length === 0 ? (
        <div className="text-center p-5 rounded-4 border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h5 className="fw-bold text-white">Ainda não avaliaste nenhum jogo!</h5>
          <p style={{ color: 'var(--text-soft)' }}>Ajuda a comunidade e deixa a tua opinião nos jogos que já conheces.</p>
        </div>
      ) : (
        <div className="row g-4">
          {avaliacoes.map((av) => (
            <div className="col-md-6" key={`av-${av.id}`}>
              <div className="d-flex p-3 rounded-4 shadow-sm border h-100 align-items-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
                
                <img 
                  src={av.Jogo?.imagem} 
                  alt={av.Jogo?.titulo} 
                  className="rounded-3 shadow-sm me-4"
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                />
                
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1 text-white">{av.Jogo?.titulo}</h5>
                  <div className="text-warning mb-2 d-flex align-items-center">
                    <FaStar className="me-1 mb-1" />
                    <span className="fw-bold text-light">{av.nota}.0</span>
                  </div>
                  <p className="mb-0 fst-italic lh-sm" style={{ color: 'var(--text-soft)' }}>
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