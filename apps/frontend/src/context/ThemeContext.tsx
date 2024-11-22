import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from 'react';
import { darkTheme } from "../themes/dark";
import { defaultTheme } from '../themes/default';
import { lightTheme } from "../themes/light";


interface ThemeContextType {
  currentTheme: ThemeType;
  changeTheme: (themeName: ThemeType) => void;
}

type ThemeType = 'default' | 'light' | 'dark' | 'rainbow' | 'purple' | 'red';


const themes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme
};

const getMergedTheme = (themeName: keyof typeof themes) => {
  return extendTheme(themes[themeName]);
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode, initialTheme: ThemeType }> = ({ children, initialTheme }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);

  const changeTheme = (themeName: ThemeType) => {
    setCurrentTheme(themeName);
  };

  const activeTheme = getMergedTheme(currentTheme as keyof typeof themes);


  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      <ChakraProvider theme={activeTheme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
