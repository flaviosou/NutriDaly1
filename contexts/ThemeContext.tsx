import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'sm' | 'base' | 'lg';

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('nutridaily-theme') as Theme;
    return savedTheme || 'light';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const savedSize = localStorage.getItem('nutridaily-fontsize') as FontSize;
    return savedSize || 'base';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('nutridaily-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = fontSize === 'sm' ? '14px' : fontSize === 'lg' ? '18px' : '16px';
    localStorage.setItem('nutridaily-fontsize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
  }

  return (
    <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize: handleSetFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
