import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JogoList from './view/JogoList';
import JogoAdd from './view/JogoAdd';
import JogoEdit from './view/JogoEdit';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      {/* Onde as páginas vão ser renderizadas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jogos/list" element={<JogoList />} />
        <Route path="/jogos/add" element={<JogoAdd />} />
        <Route path="/jogos/edit/:id" element={<JogoEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;