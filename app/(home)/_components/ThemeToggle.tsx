"use client";

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    // Check if user has a preference stored
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark mode if user prefers it or hasn't set a preference
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Moon icon with outline only, no fill */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M21.5 14.0784C20.3003 14.8406 18.8823 15.25 17.3684 15.25C12.6525 15.25 8.83684 11.4343 8.83684 6.71846C8.83684 5.20455 9.24622 3.78656 9.92146 2.5C5.60436 3.49096 2.40002 7.29871 2.40002 11.8545C2.40002 17.2727 6.78042 21.6531 12.1986 21.6531C16.7544 21.6531 20.5621 18.4488 21.5 14.0784Z" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
} 