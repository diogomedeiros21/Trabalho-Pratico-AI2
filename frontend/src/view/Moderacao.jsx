import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function Moderacao() {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDenuncias();
  }, []);

  const carregarDenuncias = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/denuncias/pendentes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDenuncias(res.data.denuncias || []);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar denúncias:", error);
      setCarregando(false);
    }
  };

  const resolverDenuncia = (id, acao) => {
    const textoAcao = acao === 'apagar' ? 'apagar este comentário' : 'ignorar esta denúncia';
    const corBotao = acao === 'apagar' ? '#ef4444' : '#10b981';

    Swal.fire({
      title: 'Tens a certeza?',
      text: `Vais ${textoAcao}. Esta ação é irreversível!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: corBotao,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, confirmar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await api.post(`/denuncias/resolver/${id}`, { acao }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          Swal.fire('Feito!', 'Ação processada com sucesso.', 'success');
          carregarDenuncias(); // Atualiza a lista
        } catch (error) {
          Swal.fire('Erro!', 'Não foi possível processar a ação.', 'error');
        }
      }
    });
  };

  if (carregando) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold text-white mb-0">🚩 Moderação de Comentários</h2>
      </div>

      {denuncias.length === 0 ? (
        <div className="alert border-0 text-center shadow-sm alert-custom">
          Fantástico! Não há denúncias pendentes no momento.
        </div>
      ) : (
        <div className="row g-4">
          {denuncias.map(denuncia => (
            <div className="col-12" key={denuncia.id}>
              <div className="custom-box p-4 rounded-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-danger mb-2">Motivo: {denuncia.motivo}</span>
                    <p className="text-soft small mb-0">
                      Denunciado por: <strong>{denuncia.Denunciador?.nome || 'Utilizador'}</strong>
                    </p>
                    <p className="text-soft small mb-0">
                      Jogo: <strong>{denuncia.Avaliacao?.Jogo?.titulo || 'Desconhecido'}</strong>
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button onClick={() => resolverDenuncia(denuncia.id, 'ignorar')} className="btn btn-sm btn-outline-success fw-bold">
                      Falso Alarme (Manter)
                    </button>
                    <button onClick={() => resolverDenuncia(denuncia.id, 'apagar')} className="btn btn-sm btn-danger fw-bold">
                      Apagar Comentário
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderLeft: '4px solid var(--accent)' }}>
                  <span className="text-warning small fw-bold">Comentário Original ({denuncia.Avaliacao?.User?.nome}):</span>
                  <p className="text-white mb-0 mt-1 fst-italic">"{denuncia.Avaliacao?.comentario}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}