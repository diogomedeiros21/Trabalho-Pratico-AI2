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
        setJogos(listaDeJogos);
      })
      .catch(error => {
        alert("Erro ao carregar os jogos: " + error);
      });
  };

  const eliminarJogo = (id) => {
    Swal.fire({
      title: 'Tem a certeza?',
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Se o utilizador clicou no botão "Sim, apagar!"
      if (result.isConfirmed) {
        api.post(`/jogos/delete/${id}`)
          .then(res => {
            if (res.data.success) {
              Swal.fire(
                'Apagado!',
                res.data.message,
                'success'
              );
              carregarJogos(); // Atualiza a tabela
            }
          })
          .catch(error => {
            Swal.fire(
              'Erro!',
              'Erro ao eliminar o jogo. Confirma se tens permissões de Admin.',
              'error'
            );
          });
      }
    });
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
          <h2>Catálogo de Jogos (Admin)</h2>
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