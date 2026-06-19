import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JogoList from './view/JogoList';

function App() {
  return (
    <BrowserRouter>
      {/* A Navbar fica fora do Routes para aparecer em todas as páginas */}
      <Navbar />
      
      {/* Onde as páginas vão ser renderizadas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jogos/list" element={<JogoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;