import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/Photos/Bad Guy Barbers Logo.png';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/home');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  // Array of routes where logout should not be shown
  const hideLogoutRoutes = ['/home', '/aboutus', '/createaccount', '/login'];

  // Check if we should show the logout text
  const shouldShowLogout = !hideLogoutRoutes.includes(location.pathname);

  return (
    <nav className="absolute top-0 left-0 w-full flex justify-between items-start p-4">
      <img
        src={Logo}
        alt="Bad Guy Barbers Logo"
        className="h-32 cursor-pointer hover:opacity-80 transition-all duration-200"
        onClick={handleLogoClick}
      />

      {shouldShowLogout && (
        <span
          onClick={handleLogout}
          className="font-jacques text-black text-lg cursor-pointer hover:text-gray-600 transition-colors duration-200 mr-6 mt-4"
        >
          Logout
        </span>
      )}
    </nav>
  );
};

export default NavBar;