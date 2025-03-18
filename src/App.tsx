import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Social from './pages/Social';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Impact from './pages/Impact';
import Donations from './pages/Donations';
import NotFound from './pages/NotFound';
import EventDetails from './pages/EventDetails';
import DevelopmentWarning from './components/DevelopmentWarning';
import Footer from './components/Footer';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <DevelopmentWarning />
      <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow mt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/social" element={<Social />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
