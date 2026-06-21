import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import api from '../services/api';

function Home() {
  const [jogos, setJogos] = useState([]);
  const [topJogos, setTopJogos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]); 
  const [termoPesquisa, setTermoPesquisa] = useState(''); 
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const token = localStorage.getItem('token');
        let idsFavoritos = [];

        if (token) {
          try {
            const respostaFavs = await api.get('/favoritos');
            const listaFavs = respostaFavs.data.favoritos || respostaFavs.data || [];
            idsFavoritos = listaFavs.map(fav => fav.id);
          } catch (e) {
            console.log("Utilizador sem favoritos.");
          }
        }

        const [respostaJogos, respostaTop] = await Promise.all([
          api.get('/jogos/list'),      
          api.get('/jogos/top-semana')    
        ]);
        
        setJogos(respostaJogos.data.data || respostaJogos.data);
        setTopJogos(respostaTop.data.data || respostaTop.data || []);
        setFavoritosIds(idsFavoritos);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  const jogosFiltrados = jogos.filter((jogo) => 
    jogo.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status"></div>
        <p className="mt-3">A carregar o catálogo...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {topJogos.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-4 fw-bold text-center text-md-start">🏆 Top da Semana</h3>
          <div className="row justify-content-center g-4">
            {topJogos.map((jogo) => (
              <div className="col-auto" key={`top-${jogo.id}`}>
                <div className="card-hover-effect">
                  <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <h3 className="fw-bold mb-0">Catálogo Completo</h3>
        
        {/* Barra de Pesquisa corrigida */}
        <div className="input-group shadow-sm" style={{ maxWidth: '400px' }}>
          <span 
            className="input-group-text border-0" 
            style={{ 
              backgroundColor: '#161e2e', // Mesma cor do input e cartões
              color: '#cbd5e1',           // Cor clara para a lupa se ver
              borderRight: 'none',
              paddingLeft: '15px'
            }}
          >
            🔍
          </span>
          <input 
            type="text" 
            className="form-control border-0 shadow-none" 
            style={{ 
              backgroundColor: '#161e2e', // Mesma cor do span
              color: '#fff',
              borderLeft: 'none'
            }}
            placeholder="Pesquisar por nome..." 
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>
      
      {jogos.length === 0 ? (
        <div className="alert border-0 text-center shadow-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-soft)' }}>
          Ainda não há jogos na plataforma.
        </div>
      ) : jogosFiltrados.length === 0 ? (
        <div className="alert border-0 text-center shadow-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-soft)' }}>
          Não encontrámos nenhum jogo com o nome "<strong>{termoPesquisa}</strong>".
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {jogosFiltrados.map((jogo) => (
            <div className="col-auto" key={jogo.id}>
              <div className="card-hover-effect">
                <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;