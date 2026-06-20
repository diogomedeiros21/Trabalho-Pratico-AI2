import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import api from '../services/api';

function Perfil() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarFavoritos = async () => {
      try {
        const resposta = await api.get('/favoritos');
        setFavoritos(resposta.data.favoritos || resposta.data || []);
        setCarregando(false);
      } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
        setCarregando(false);
      }
    };

    buscarFavoritos();
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
          <p className="text-muted mb-0 fs-5">A tua biblioteca pessoal de favoritos</p>
        </div>
      </div>

      <hr className="mb-5" />

      {/* Secção dos Favoritos */}
      <h3 className="fw-bold mb-4">❤️ Os Meus Favoritos</h3>
      
      {favoritos.length === 0 ? (
        <div className="alert alert-secondary text-center shadow-sm p-4 border-0">
          <h5 className="fw-bold">Ainda não tens jogos favoritos!</h5>
          <p className="mb-0">Vai ao catálogo e clica nalguns corações para construíres a tua coleção.</p>
        </div>
      ) : (
        <div className="row g-4">
          {favoritos.map((jogo) => (
            <div className="col-md-4" key={jogo.id}>
              {/* Dizer logo ao cartão que este jogo tem de ter o coração vermelho! */}
              <JogoCard jogo={jogo} favoritoInicial={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Perfil;