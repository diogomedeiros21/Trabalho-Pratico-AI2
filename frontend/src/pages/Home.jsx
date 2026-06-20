import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import api from '../services/api';

function Home() {
  const [jogos, setJogos] = useState([]);
  const [topJogos, setTopJogos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]); // Guarda só os números de ID dos favoritos
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const token = localStorage.getItem('token');
        let idsFavoritos = [];

        // Se o utilizador estiver com Login feito, vai buscar os favoritos dele em silêncio
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
          api.get('/jogos/top')
        ]);
        
        setJogos(respostaJogos.data.jogos || respostaJogos.data);
        setTopJogos(respostaTop.data.jogos || respostaTop.data || []);
        setFavoritosIds(idsFavoritos); // Guarda os IDs
        
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Não foi possível carregar a lista de jogos.");
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

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
      
      {topJogos.length > 0 && (
        <div className="mb-5 p-4 bg-dark rounded-4 shadow-lg text-white">
          <h3 className="mb-4 fw-bold text-warning">🏆 Top da Semana</h3>
          <div className="row g-4">
            {topJogos.map((jogo) => (
              <div className="col-md-4" key={`top-${jogo.id}`}>
                {/* Verifica se o ID deste jogo está na lista dos teus favoritos */}
                <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="mb-4 fw-bold text-dark">Catálogo Completo</h3>
      
      {jogos.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          Ainda não há jogos inseridos na plataforma.
        </div>
      ) : (
        <div className="row g-4">
          {jogos.map((jogo) => (
            <div className="col-md-4" key={jogo.id}>
              {/* Faz a mesma verificação aqui! */}
              <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default Home;