/**
 * ThemeProvider.tsx
 * A context provider for sharing design tokens throughout the application
 */

import React, { createContext, useContext, ReactNode } from 'react';
import tokens from '@/styles/DesignTokens';

// Create a context with our design tokens
export const ThemeContext = createContext(tokens);

// Hook for accessing the theme tokens
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  theme?: typeof tokens; // Allow overriding the default theme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = tokens 
}) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
