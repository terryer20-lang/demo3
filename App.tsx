
import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Challenge from './pages/Challenge';
import SafetyIndex from './pages/SafetyIndex';
import Emergency from './pages/Emergency';
import Protection from './pages/Protection';
import Rights from './pages/Rights';
import Help from './pages/Help';
import Prepare from './pages/Prepare';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Graphics from './pages/Graphics';
import PastNotifications from './pages/PastNotifications';
import NotificationDetail from './pages/NotificationDetail';
import HotKnowledge from './pages/HotKnowledge';
import KnowledgeDetail from './pages/KnowledgeDetail';
import Contact from './pages/Contact';
import GameZone from './pages/GameZone';
import GameA from './pages/GameA';
import GameB from './pages/GameB';
import GameC from './pages/GameC';
import GameD from './pages/GameD';
import GameE from './pages/GameE';
import GameF from './pages/GameF';
import GameG from './pages/GameG';
import GameH from './pages/GameH';
import GameI from './pages/GameI';
import GameJ from './pages/GameJ';
import GameRightsDecoder from './pages/GameRightsDecoder';
import { LanguageProvider } from './LanguageContext';

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
   return (
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/safety-index" element={<SafetyIndex />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/protection" element={<Protection />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/help" element={<Help />} />
          <Route path="/prepare" element={<Prepare />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/graphics" element={<Graphics />} />
          <Route path="/past-notifications" element={<PastNotifications />} />
          <Route path="/hot-knowledge" element={<HotKnowledge />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game-zone" element={<GameZone />} />
          <Route path="/game-zone/a" element={<GameA />} />
          <Route path="/game-zone/b" element={<GameB />} />
          <Route path="/game-zone/c" element={<GameRightsDecoder />} />
          <Route path="/game-zone/d" element={<GameD />} />
          <Route path="/game-zone/e" element={<GameE />} />
          <Route path="/game-zone/f" element={<GameF />} />
          <Route path="/game-zone/g" element={<GameG />} />
          <Route path="/game-zone/h" element={<GameH />} />
          <Route path="/game-zone/i" element={<GameI />} />
          <Route path="/game-zone/j" element={<GameJ />} />
          
          <Route path="/safety-card" element={<GameC />} />
          
          <Route path="/notification/:id" element={<NotificationDetail />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
   )
}

const App = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
