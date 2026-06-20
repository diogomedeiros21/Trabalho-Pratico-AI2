import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import api from '../services/api';

function Home() {
  const [jogos, setJogos] = useState([]);
  const [topJogos, setTopJogos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]); 
  
  // Estado da pesquisa
  const [termoPesquisa, setTermoPesquisa] = useState(''); 
  
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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
            console.log("Utilizador sem favoritos ou sessão expirada.");
          }
        }

        const [respostaJogos, respostaTop] = await Promise.all([
          api.get('/jogos'),
          api.get('/jogos/top-semana')
        ]);
        
        setJogos(respostaJogos.data.jogos || respostaJogos.data);
        setTopJogos(respostaTop.data.jogos || respostaTop.data || []);
        setFavoritosIds(idsFavoritos);
        
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Não foi possível carregar a lista de jogos.");
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  // Cria uma lista nova só com os jogos que têm o texto da pesquisa
  const jogosFiltrados = jogos.filter((jogo) => 
    jogo.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 fw-semibold">A carregar o catálogo de jogos...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      
      {/* SECÇÃO: TOP DA SEMANA */}
      {topJogos.length > 0 && (
        <div className="mb-5 p-4 bg-dark rounded-4 shadow-lg text-white">
          <h3 className="mb-4 fw-bold text-warning">🏆 Top da Semana</h3>
          <div className="row g-4">
            {topJogos.map((jogo) => (
              <div className="col-md-4" key={`top-${jogo.id}`}>
                <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CABEÇALHO DO CATÁLOGO COM A BARRA DE PESQUISA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h3 className="fw-bold text-dark mb-0">Catálogo Completo</h3>
        
        {/* BARRA DE PESQUISA VISUAL */}
        <div className="input-group shadow-sm" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0" 
            placeholder="Pesquisar por nome..." 
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>
      
      {/* SECÇÃO: CATÁLOGO FILTRADO */}
      {jogos.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          Ainda não há jogos inseridos na plataforma.
        </div>
      ) : jogosFiltrados.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm">
          Não encontrámos nenhum jogo com o nome "<strong>{termoPesquisa}</strong>".
        </div>
      ) : (
        <div className="row g-4">
          {jogosFiltrados.map((jogo) => (
            <div className="col-md-4" key={jogo.id}>
              <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default Home;