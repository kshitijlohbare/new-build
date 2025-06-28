import { createContext, useContext, useEffect, useState } from 'react';
import tokens from '@/styles/DesignTokens';

// Define theme types
type ThemeMode = 'light' | 'dark' | 'system';

// Enhanced theme context with design tokens
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  tokens: typeof tokens; // Make design tokens available through context
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get initial theme from local storage or default to system
  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'system';
  };

  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  // Apply theme to document
  const applyTheme = (newTheme: ThemeMode) => {
    const root = window.document.documentElement;
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Update class
    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');

    // Store preference
    localStorage.setItem('theme', newTheme);
  };

  // Set theme with local storage persistence
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // If system preference, toggle to explicit light/dark
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemIsDark ? 'light' : 'dark');
    }
  };

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        setTheme,
        tokens // Provide access to design tokens
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}