import { createContext, useContext } from 'react';

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('Context must be used within ThemeProvider');
  }
  return context;
}
