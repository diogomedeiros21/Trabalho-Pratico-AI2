import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function JogoList() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    carregarJogos();
  }, []);

  const carregarJogos = () => {
    axios.get('http://localhost:3000/jogos/list')
      .then(res => {
        if (res.data.success) {
          setJogos(res.data.data);
        }
      })
      .catch(error => {
        alert("Erro ao carregar os jogos: " + error);
      });
  };

  // Efetua o pedido de eliminação e recarrega a lista em caso de sucesso
  const eliminarJogo = (id) => {
    if (window.confirm("Tem a certeza que pretende eliminar este jogo?")) {
      axios.post(`http://localhost:3000/jogos/delete/${id}`)
        .then(res => {
          if (res.data.success) {
            alert(res.data.message);
            carregarJogos(); // Atualiza a tabela imediatamente
          }
        })
        .catch(error => {
          alert("Erro ao eliminar o jogo: " + error);
        });
    }
  };

  const preencherTabela = () => {
    return jogos.map((jogo, index) => {
      return (
        <tr key={index}>
          <th>{jogo.id}</th>
          <td>{jogo.titulo}</td>
          <td>{jogo.Categoria ? jogo.Categoria.nome : 'Sem Categoria'}</td>
          <td>
            <Link to={`/jogos/edit/${jogo.id}`} className="btn btn-outline-info">Editar</Link>
          </td>
          <td>
            {/* O clique aciona a função de eliminação passando o ID do jogo */}
            <button onClick={() => eliminarJogo(jogo.id)} className="btn btn-outline-danger">Apagar</button>
          </td>
        </tr>
      );
    });
  };

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