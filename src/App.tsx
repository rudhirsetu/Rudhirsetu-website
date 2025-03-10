import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
      <DevelopmentWarning />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow mt-14">
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
