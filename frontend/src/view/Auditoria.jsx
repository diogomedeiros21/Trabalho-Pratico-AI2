import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Auditoria() {
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarLogs();
  }, []);

  const carregarLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/auditoria/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data || []);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao carregar auditoria:", error);
      setErro('Não foi possível carregar os registos de auditoria.');
      setCarregando(false);
    }
  };

  // Função para formatar a data para o padrão português
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para dar cores diferentes dependendo da ação
  const badgeAcao = (acao) => {
    if (acao.includes('CRIAR')) return <span className="badge bg-success">{acao}</span>;
    if (acao.includes('APAGAR')) return <span className="badge bg-danger">{acao}</span>;
    if (acao.includes('EDITAR')) return <span className="badge bg-warning text-dark">{acao}</span>;
    if (acao.includes('MODERACAO')) return <span className="badge bg-info text-dark">{acao}</span>;
    return <span className="badge bg-secondary">{acao}</span>;
  };

  if (carregando) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="container py-5 mb-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold text-white mb-0">Registo de logs</h2>
      </div>

      {erro && <div className="alert alert-danger border-0 shadow-sm">{erro}</div>}

      <div className="custom-box p-4 rounded-4 shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <p className="text-center text-soft my-4">Ainda não há ações registadas no sistema.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="text-warning">
                  <th scope="col" className="bg-transparent border-bottom border-secondary">Data / Hora</th>
                  <th scope="col" className="bg-transparent border-bottom border-secondary">Administrador</th>
                  <th scope="col" className="bg-transparent border-bottom border-secondary">Ação</th>
                  <th scope="col" className="bg-transparent border-bottom border-secondary">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="bg-transparent border-bottom border-secondary text-soft small text-nowrap">
                      {formatarData(log.createdAt)}
                    </td>
                    <td className="bg-transparent border-bottom border-secondary fw-bold">
                      {log.Admin?.nome || 'Admin Desconhecido'}
                      <div className="text-soft fw-normal" style={{ fontSize: '0.8rem' }}>
                        {log.Admin?.email}
                      </div>
                    </td>
                    <td className="bg-transparent border-bottom border-secondary">
                      {badgeAcao(log.acao)}
                    </td>
                    <td className="bg-transparent border-bottom border-secondary text-soft">
                      {log.detalhes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}