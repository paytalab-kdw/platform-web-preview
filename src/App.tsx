import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StorePage from './pages/store/StorePage';
import MenuPage from './pages/menu/MenuPage';
import MagazinePage from './pages/magazine/MagazinePage';
import MagazinePreviewPage from './pages/magazine/MagazinePreviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route path="/magazine/preview" element={<MagazinePreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
