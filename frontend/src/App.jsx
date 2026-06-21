import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import DetalhesJogo from './pages/DetalhesJogo';
import JogoList from './view/JogoList';
import JogoAdd from './view/JogoAdd';
import JogoEdit from './view/JogoEdit';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jogo/:id" element={<DetalhesJogo />} />
        
        {/* Rotas de Administração (CRUD) */}
        <Route path="/jogos/list" element={<JogoList />} />
        <Route path="/jogos/add" element={<JogoAdd />} />
        <Route path="/jogos/edit/:id" element={<JogoEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;