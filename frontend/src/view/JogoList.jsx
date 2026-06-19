import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componente principal para listar os jogos
export default function JogoList() {
  // Inicializa o estado para guardar a lista de jogos recebida da API
  const [jogos, setJogos] = useState([]);

  // Executa o pedido HTTP assim que o componente é carregado no ecrã
  useEffect(() => {
    carregarJogos();
  }, []);

  // Efetua a chamada à API para obter a lista completa de jogos
  const carregarJogos = () => {
    axios.get('http://localhost:3000/jogos/list')
      .then(res => {
        if (res.data.success) {
          // Atualiza o estado com os dados recebidos com sucesso
          setJogos(res.data.data);
        }
      })
      .catch(error => {
        alert("Erro ao carregar os jogos: " + error);
      });
  };

  // Função auxiliar para construir as linhas da tabela com os dados
  const preencherTabela = () => {
    return jogos.map((jogo, index) => {
      return (
        <tr key={index}>
          <th>{jogo.id}</th>
          <td>{jogo.titulo}</td>
          <td>{jogo.Categoria ? jogo.Categoria.nome : 'Sem Categoria'}</td>
          <td>
            {/* Botão para navegar para a página de edição do jogo específico */}
            <Link to={`/jogos/edit/${jogo.id}`} className="btn btn-outline-info">Editar</Link>
          </td>
          <td>
            {/* Botão para acionar a eliminação (a função de apagar será adicionada depois) */}
            <button className="btn btn-outline-danger">Apagar</button>
          </td>
        </tr>
      );
    });
  };

  // Constrói a estrutura visual da página com a tabela do Bootstrap
  return (
    <div className="container py-4">
      <div className="row mb-3">
        <div className="col">
          <h2>Catálogo de Jogos</h2>
        </div>
        <div className="col text-end">
          <Link to="/jogos/add" className="btn btn-primary">Adicionar Jogo</Link>
        </div>
      </div>
      <table className="table table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Título</th>
            <th scope="col">Categoria</th>
            <th scope="col" colSpan="2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {preencherTabela()}
        </tbody>
      </table>
    </div>
  );
}