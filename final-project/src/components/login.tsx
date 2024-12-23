import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { LoginFormSkeleton } from './Skeleton';
import logo from '../assets/Bad Guy Barbers Logo.png';

interface UserData {
  username: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateAccount = () => {
    navigate('/createaccount');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const user = users.find((u: UserData) => 
        u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/barberselection');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  const logoAnimation = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="login-container">
          <motion.div 
            className="logo-container cursor-pointer" 
            onClick={handleLogoClick}
            {...logoAnimation}
          >
            <img 
              src={logo} 
              alt="Bad Guy Barbers" 
              className="logo hover:opacity-80 transition-all duration-200" 
            />
          </motion.div>
          <LoginFormSkeleton />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="login-container">
        <motion.div 
          className="logo-container cursor-pointer" 
          onClick={handleLogoClick}
          {...logoAnimation}
        >
          <img 
            src={logo} 
            alt="Bad Guy Barbers" 
            className="logo hover:opacity-80 transition-all duration-200" 
          />
        </motion.div>

        <motion.div
          className="login-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <motion.div 
              className="flex flex-col gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label className="input-label">Username</label>
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div 
              className="flex flex-col gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div 
              className="flex flex-col gap-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <button type="submit" className="button button-login">
                Login
              </button>
              <button 
                type="button" 
                className="button button-create-account"
                onClick={handleCreateAccount}
              >
                Create Account
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Login;