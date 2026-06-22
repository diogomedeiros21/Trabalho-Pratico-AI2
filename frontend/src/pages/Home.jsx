import { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import api from '../services/api';

function Home() {
  const [jogos, setJogos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [tipoRanking, setTipoRanking] = useState('avaliados');
  const [favoritosIds, setFavoritosIds] = useState([]); 
  const [categorias, setCategorias] = useState([]); 
  const [carregando, setCarregando] = useState(true);

  // Estados dos Filtros
  const [termoPesquisa, setTermoPesquisa] = useState(''); 
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [notaMinima, setNotaMinima] = useState('');
  const [anoFiltro, setAnoFiltro] = useState(''); // Adicionado filtro de Ano

  const carregarRanking = async (tipo) => {
    try {
      const res = await api.get(`/jogos/ranking/${tipo}`);
      setRanking(res.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    }
  };

  useEffect(() => {
    const buscarDadosIniciais = async () => {
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

        const [respostaJogos, respostaCategorias] = await Promise.all([
          api.get('/jogos/list'),
          api.get('/categorias')
        ]);

        setJogos(respostaJogos.data.data || respostaJogos.data);
        setCategorias(respostaCategorias.data.data || respostaCategorias.data || []);
        setFavoritosIds(idsFavoritos);

        await carregarRanking('avaliados');
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setCarregando(false);
      }
    };
    
    buscarDadosIniciais();
  }, []);

  const handleMudancaRanking = (tipo) => {
    setTipoRanking(tipo);
    carregarRanking(tipo);
  };

  // A MAGIA DOS FILTROS COMBINADOS
  const jogosFiltrados = jogos.filter((jogo) => {
    const matchNome = jogo.titulo.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria = categoriaSelecionada ? jogo.categoriaId === Number(categoriaSelecionada) : true;
    const matchNota = notaMinima ? parseFloat(jogo.notaMedia) >= parseFloat(notaMinima) : true;
    const matchAno = anoFiltro ? jogo.anoLancamento === Number(anoFiltro) : true;

    return matchNome && matchCategoria && matchNota && matchAno;
  });

  if (carregando) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-white">A carregar o catálogo...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      
      {/* SECÇÃO DOS RANKINGS DINÂMICOS */}
      <div className="mb-5 custom-box p-4 rounded-4 shadow-sm">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
          <h3 className="fw-bold mb-0">🏆 Pódio MundoGaming</h3>
          
          <div className="btn-group shadow-sm" role="group">
            <button 
              type="button" 
              className={`btn fw-bold ${tipoRanking === 'avaliados' ? 'btn-warning text-dark' : 'btn-outline-secondary text-light border-0'}`}
              style={tipoRanking !== 'avaliados' ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              onClick={() => handleMudancaRanking('avaliados')}
            >
              ⭐ Mais Bem Avaliados
            </button>
            <button 
              type="button" 
              className={`btn fw-bold ${tipoRanking === 'populares' ? 'btn-warning text-dark' : 'btn-outline-secondary text-light border-0'}`}
              style={tipoRanking !== 'populares' ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              onClick={() => handleMudancaRanking('populares')}
            >
              ❤️ Mais Populares
            </button>
            <button 
              type="button" 
              className={`btn fw-bold ${tipoRanking === 'comentados' ? 'btn-warning text-dark' : 'btn-outline-secondary text-light border-0'}`}
              style={tipoRanking !== 'comentados' ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              onClick={() => handleMudancaRanking('comentados')}
            >
              💬 Mais Comentados
            </button>
          </div>
        </div>

        <div className="row justify-content-center g-4">
          {ranking.length === 0 ? (
            <p className="text-center text-soft">Ainda não há dados suficientes para criar um pódio.</p>
          ) : (
            ranking.map((jogo) => (
              <div className="col-auto" key={`rank-${jogo.id}`}>
                <div className="card-hover-effect">
                  <JogoCard jogo={jogo} favoritoInicial={favoritosIds.includes(jogo.id)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="mb-5 hr-custom" />

      {/* SECÇÃO DO CATÁLOGO COMPLETO E FILTROS ALINHADOS */}
      <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-4 gap-3">
        <h3 className="fw-bold mb-0 text-nowrap">Catálogo Completo</h3>
        
        {/* Agrupamento dos Filtros à direita */}
        <div className="d-flex flex-column flex-md-row gap-2 w-100 justify-content-xl-end">
          
          {/* 1. Pesquisa por Texto */}
          <div className="input-group shadow-sm flex-grow-1" style={{ maxWidth: '300px' }}>
            <span className="input-group-text search-icon border-0">🔍</span>
            <input 
              type="text" 
              className="form-control shadow-none search-input border-0" 
              placeholder="Pesquisar nome..." 
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
          </div>

          {/* 2. Filtro por Categoria */}
          <select 
            className="form-select border-0 shadow-sm w-auto" 
            style={{ backgroundColor: 'var(--card-bg)', color: '#fff' }}
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>

          {/* 3. Filtro por Ano */}
          <input 
            type="number" 
            className="form-control border-0 shadow-sm w-auto" 
            style={{ backgroundColor: 'var(--card-bg)', color: '#fff', maxWidth: '120px' }}
            placeholder="Ano" 
            value={anoFiltro}
            onChange={(e) => setAnoFiltro(e.target.value)}
          />

          {/* 4. Filtro por Nota Média */}
          <select 
            className="form-select border-0 shadow-sm w-auto" 
            style={{ backgroundColor: 'var(--card-bg)', color: '#fff' }}
            value={notaMinima}
            onChange={(e) => setNotaMinima(e.target.value)}
          >
            <option value="">Qualquer Nota</option>
            <option value="1">⭐ 1.0+</option>
            <option value="2">⭐ 2.0+</option>
            <option value="3">⭐ 3.0+</option>
            <option value="4">⭐ 4.0+</option>
            <option value="5">⭐ 5.0</option>
          </select>

        </div>
      </div>
      
      {/* LISTAGEM DOS JOGOS */}
      {jogos.length === 0 ? (
        <div className="alert border-0 text-center shadow-sm alert-custom">
          Ainda não há jogos na plataforma.
        </div>
      ) : jogosFiltrados.length === 0 ? (
        <div className="alert border-0 text-center shadow-sm alert-custom">
          Nenhum jogo corresponde aos teus filtros.
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {jogosFiltrados.map((jogo) => (
            <div className="col-auto" key={`cat-${jogo.id}`}>
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