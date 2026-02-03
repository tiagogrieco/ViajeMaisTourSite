import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Packages from './pages/Packages';
// import Store from './pages/Store'; // New Store
import GlowIA from './pages/GlowIA';
import StyleMirror from './pages/StyleMirror';
import Admin from './pages/Admin';
import LojaAfiliados from './pages/LojaAfiliados';
import DestinoQuiz from './pages/DestinoQuiz';
import CalculadoraViagem from './pages/CalculadoraViagem';
import { incrementVisitors } from './services/api';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  useEffect(() => {
    // Count visit only once per session
    const visited = sessionStorage.getItem('visited');
    if (!visited) {
      incrementVisitors();
      sessionStorage.setItem('visited', 'true');
    }
  }, []);

  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/pacotes" element={<Packages />} />
        {/* <Route path="/loja" element={<Store />} /> */}
        <Route path="/consultoria-ia" element={<GlowIA />} />
        <Route path="/visualizador-destinos" element={<StyleMirror />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/loja-afiliados" element={<LojaAfiliados />} />
        <Route path="/quiz-destino" element={<DestinoQuiz />} />
        <Route path="/calculadora" element={<CalculadoraViagem />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
