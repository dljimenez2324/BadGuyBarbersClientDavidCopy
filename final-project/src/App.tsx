import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './components/login';
import CreateAccount from './components/createaccount';
import BarberSelection from './components/barberselection';
import BarberServices from './components/barberservices';
import './App.css';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ChooseTimePage from './components/ChooseTimePage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect root path to landing page */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/time" element={<ChooseTimePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/barberselection" element={<BarberSelection />} />
        <Route path="/barberservices" element={<BarberServices/>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;