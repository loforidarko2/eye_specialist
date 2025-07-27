import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { LightTheme, DarkTheme } from './themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('auto'); // 'light' | 'dark' | 'auto'
  const colorScheme = Appearance.getColorScheme();

  const getTheme = () => {
    if (mode === 'light') return LightTheme;
    if (mode === 'dark') return DarkTheme;
    return colorScheme === 'dark' ? DarkTheme : LightTheme;
  };

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [mode, colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
