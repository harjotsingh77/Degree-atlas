import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext.jsx';
import { ShortlistProvider } from './context/ShortlistContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { Header, Footer } from './components/Chrome.jsx';
import { CompareTray, CompareModal } from './components/Compare.jsx';
import GlobalSearchModal from './components/GlobalSearchModal.jsx';
import { ScrollToTopBtn } from './components/ScrollToTopBtn.jsx';
import AtlasChatBot from './components/AtlasChatBot.jsx';
import HomePage from './pages/HomePage.jsx';
import UniversityPage from './pages/UniversityPage.jsx';
import ProgrammePage from './pages/ProgrammePage.jsx';
import ArticlesPage from './pages/ArticlesPage.jsx';
import ArticleDetailPage from './pages/ArticleDetailPage.jsx';
import AllProgrammesPage from './pages/AllProgrammesPage.jsx';
import AllUniversitiesPage from './pages/AllUniversitiesPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import ShortlistPage from './pages/ShortlistPage.jsx';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <CompareProvider>
      <ShortlistProvider>
        <BrowserRouter>
          <SearchProvider>
            <ScrollToTop />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shortlist" element={<ShortlistPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/programmes" element={<AllProgrammesPage />} />
              <Route path="/all-programmes" element={<AllProgrammesPage />} />
              <Route path="/universities" element={<AllUniversitiesPage />} />
              <Route path="/universities/:slug" element={<UniversityPage />} />
              <Route path="/programmes/:slug" element={<ProgrammePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
            <Footer />
            <CompareTray />
            <CompareModal />
            <GlobalSearchModal />
            <ScrollToTopBtn />
            <AtlasChatBot />
          </SearchProvider>
        </BrowserRouter>
      </ShortlistProvider>
    </CompareProvider>
  );
}

