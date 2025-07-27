import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './navigation/RootNavigation';
import { ThemeProvider } from './theme/ThemeContext'; 

export default function App() {
  return (
    <ThemeProvider> {/* ✅ Wrap with your provider */}
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </ThemeProvider>
  );
}
