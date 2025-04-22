// DarkModeToggle.jsx
import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>
);

export default DarkModeToggle;
