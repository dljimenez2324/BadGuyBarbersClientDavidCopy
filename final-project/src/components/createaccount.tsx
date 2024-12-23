import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import { LoginFormSkeleton } from './Skeleton';
import logo from '../assets/Bad Guy Barbers Logo.png';

interface UserData {
  username: string;
  password: string;
}

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const saveUserData = (userData: UserData) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (existingUsers.some((user: UserData) => user.username === userData.username)) {
        throw new Error('Username already exists');
      }

      existingUsers.push(userData);
      
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const userData: UserData = {
      username: formData.username,
      password: formData.password
    };

    if (saveUserData(userData)) {
      navigate('/barberselection');
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
          <h2 className="login-title">Create Account</h2>
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
              className="flex flex-col gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input-field"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </motion.div>

            <motion.div 
              className="flex flex-col gap-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <button type="submit" className="button button-login">
                Create Account
              </button>
              <button
                type="button"
                onClick={handleLoginClick}
                className="text-white hover:text-gray-300 transition-colors duration-200 mt-4 cursor-pointer text-center"
              >
                Already have an account?
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default CreateAccount;