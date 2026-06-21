import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function JogoList() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    carregarJogos();
  }, []);

  const carregarJogos = () => {
    api.get('/jogos/list')
      .then(res => {
        const listaDeJogos = res.data.data ? res.data.data : res.data;
        
        // ADICIONA ESTA LINHA AQUI:
        console.log("MATRIX DOS DADOS:", listaDeJogos); 
        
        setJogos(listaDeJogos);
      })
      .catch(error => {
        Swal.fire({
          title: 'Erro!',
          text: "Erro ao carregar os jogos: " + error,
          icon: 'error'
        });
      });
  };

  const eliminarJogo = (id) => {
    const token = localStorage.getItem('token');
    
    Swal.fire({
      title: 'Tem a certeza?',
      text: "Esta ação apagará o jogo permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        api.post(`/jogos/delete/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            if (res.data.success || res.status === 200) {
              Swal.fire(
                'Apagado!',
                res.data.message || 'O jogo foi removido da base de dados.',
                'success'
              );
              carregarJogos();
            }
          })
          .catch(error => {
            Swal.fire(
              'Acesso Negado!',
              error.response?.data?.message || 'Erro ao eliminar. Confirma se tens permissões de Admin.',
              'error'
            );
          });
      }
    });
  };

  

  return (
    <div className="container py-5">
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          {/* Corrigido para text-dark para ser visível no fundo branco */}
            <h2 className="fw-bold text-white mb-0">⚙️ Gestão de Catálogo</h2>          <p className="text-secondary mb-0">Administração exclusiva da base de dados</p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <Link to="/jogos/add" className="btn btn-warning fw-bold px-4 py-2 text-dark shadow-sm">
            + Adicionar Jogo
          </Link>
        </div>
      </div>
      
      <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col" className="ps-4 py-3 text-light">ID</th>
                <th scope="col" className="py-3 text-light">Título do Jogo</th>
                <th scope="col" className="py-3 text-light">Categoria</th>
                <th scope="col" className="text-end pe-4 py-3 text-light">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {jogos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    Nenhum jogo encontrado no sistema.
                  </td>
                </tr>
              ) : (
                jogos.map((jogo) => (
                  <tr key={jogo.id}>
                    <th scope="row" className="ps-4 fw-normal text-secondary">#{jogo.id}</th>
                    <td className="fw-semibold">{jogo.titulo}</td>
                    <td>
                      <span className="badge px-3 py-2" style={{ backgroundColor: '#334155', color: '#94a3b8' }}>
                        {jogo.Categoria?.nome || jogo.categoria?.nome || 'Sem Categoria'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm">
                        <Link to={`/jogos/edit/${jogo.id}`} className="btn btn-sm btn-outline-info px-3">
                          Editar
                        </Link>
                        <button onClick={() => eliminarJogo(jogo.id)} className="btn btn-sm btn-outline-danger px-3">
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}