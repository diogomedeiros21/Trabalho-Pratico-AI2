import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaFlag } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api';

function DetalhesJogo() {
  const { id } = useParams(); 
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const resposta = await api.get(`/jogos/get/${id}`);
        const dadosJogo = resposta.data.data ? resposta.data.data[0] : resposta.data;
        setJogo(dadosJogo);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setErro("Não foi possível carregar os detalhes deste jogo.");
        setCarregando(false);
      }
    };

    buscarDetalhes();
  }, [id]);

  const handleDenunciar = (avaliacaoId) => {
    if (!localStorage.getItem('token')) {
      return Swal.fire({
        title: 'Atenção',
        text: 'Precisas de iniciar sessão para denunciar.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
    }

    Swal.fire({
      title: 'Denunciar Comentário',
      text: 'Qual é o problema com esta avaliação?',
      input: 'select',
      inputOptions: {
        'Linguagem Ofensiva': 'Linguagem Ofensiva',
        'Spoiler': 'Contém Spoiler',
        'Spam': 'Spam / Publicidade',
        'Outro': 'Outro Motivo'
      },
      inputPlaceholder: 'Seleciona um motivo...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      confirmButtonText: 'Enviar Denúncia',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        api.post('/denuncias', {
          avaliacaoId: avaliacaoId,
          motivo: result.value
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
          if (res.data.success) {
            Swal.fire({
              title: 'Obrigado!',
              text: res.data.message,
              icon: 'success',
              confirmButtonColor: '#10b981'
            });
          }
        })
        .catch(erro => {
          Swal.fire({
            title: 'Atenção',
            text: erro.response?.data?.message || 'Erro ao enviar a denúncia.',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        });
      }
    });
  };

  if (carregando) return <div className="container mt-5 text-center text-light"><div className="spinner-border text-warning"></div></div>;
  if (erro) return <div className="container mt-5 alert alert-danger border-0 shadow-sm">{erro}</div>;
  if (!jogo) return <div className="container mt-5 alert alert-warning border-0 shadow-sm">Jogo não encontrado.</div>;

  const avaliacoes = jogo.Avaliacoes || jogo.Avaliacaos || [];

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-light mb-4 fw-bold">← Voltar ao Catálogo</Link>
      
      <div className="row p-4 p-md-5 rounded-4 shadow-sm custom-box">
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img 
            src={jogo.imagem} 
            alt={jogo.titulo} 
            className="img-fluid rounded-4 shadow detalhes-img" 
          />
        </div>

        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-white">{jogo.titulo}</h1>
            <span className="badge px-3 py-2 badge-category">{jogo.Categoria?.nome || 'Sem Categoria'}</span>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {jogo.anoLancamento && (
              <span className="badge badge-detail py-2 px-3">
                Ano: {jogo.anoLancamento}
              </span>
            )}
            {jogo.rating && (
              <span className="badge badge-detail py-2 px-3">
                Rating: {jogo.rating} / 10
              </span>
            )}
          </div>
          
          <h4 className="text-warning fw-bold mb-4 d-flex align-items-center">
            <FaStar className="mb-1 me-2" /> {parseFloat(jogo.notaMedia || 0).toFixed(1)} / 5.0 
            <span className="ms-2 fs-6 fw-normal text-soft">(Comunidade)</span>
          </h4>

          <h5 className="fw-bold text-white">Sobre o jogo:</h5>
          <p className="mb-4 text-lh-large text-soft">
            {jogo.descricao || "Nenhuma descrição disponível para este jogo."}
          </p>

          <hr className="my-4 hr-custom" />

          <h5 className="fw-bold mb-3 text-white">O que a comunidade diz:</h5>
          
          {avaliacoes.length === 0 ? (
            <p className="fst-italic text-soft">Ainda não há comentários. Sê o primeiro a avaliar!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-3 rounded-3 comment-box comment-bg">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold text-warning">
                      {av.User?.nome || av.user?.nome || 'Utilizador'}
                    </span>
                    
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-warning fw-bold d-flex align-items-center gap-1">
                        <FaStar className="mb-1"/> {av.nota}.0
                      </span>
                      
                      <button 
                        onClick={() => handleDenunciar(av.id)} 
                        className="btn-flag hover-danger text-muted" 
                        title="Denunciar comentário"
                      >
                        <FaFlag size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mb-0 text-white">{av.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesJogo;