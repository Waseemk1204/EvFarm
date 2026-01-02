import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { Blogs } from './pages/Blogs';
import { BlogPost } from './pages/BlogPost';
import { Products } from './pages/Products';
import { GetQuote } from './pages/GetQuote';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/get-quote" element={<GetQuote />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
  );
}