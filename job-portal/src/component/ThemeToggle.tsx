import React from 'react';
import { useTheme } from '../ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 transition-colors duration-300 ease-in-out"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ backgroundColor: darkMode ? '#FFF' : '#1E293B' }}
    >
      {darkMode ? (
        <FaSun className="text-yellow-500" size={20} />
      ) : (
        <FaMoon className="text-blue-300" size={20} />
      )}
    </button>
  );
};

export default ThemeToggle; 