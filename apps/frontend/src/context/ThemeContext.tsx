import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createContext, ReactNode, useState } from 'react';
import { darkTheme } from "../themes/dark";
import { defaultTheme } from '../themes/default';
import { lightTheme } from "../themes/light";
import { purpleTheme } from "../themes/purple";
import { rainbowTheme } from "../themes/rainbow";
import { redTheme } from "../themes/red";


interface ThemeContextType {
  currentTheme: ThemeType;
  changeTheme: (themeName: ThemeType) => void;
  currentFontStyle: FontStyleType;
  changeFontStyle: (fontStyle: FontStyleType) => void;
}

type ThemeType = 'default' | 'light' | 'dark' | 'rainbow' | 'purple' | 'red';
type FontStyleType = "playfair" | "kalam" | "montserrat";


const themes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme,
  purple: purpleTheme,
  red: redTheme,
  rainbow: rainbowTheme
};

const fontStyles = {
  playfair: { fonts: { body: "Playfair Display, serif", heading: "Playfair Display, serif" } },
  kalam: { fonts: { body: "Kalam, cursive", heading: "Kalam, cursive" } },
  montserrat: { fonts: { body: "Montserrat, sans-serif", heading: "Montserrat, sans-serif" } },
};

const getMergedTheme = (themeName: keyof typeof themes, fontStyle: keyof typeof fontStyles) => {
  return extendTheme({
    ...themes[themeName],
    ...fontStyles[fontStyle],
    styles: {
      global: {
        body: {
          fontFamily: fontStyles[fontStyle].fonts.body,
        },
        heading: {
          fontFamily: fontStyles[fontStyle].fonts.heading,
        },
      },
    },
  });
};


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode, initialTheme: ThemeType, initialFontStyle: FontStyleType }> = ({ children, initialTheme, initialFontStyle }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [currentFontStyle, setCurrentFontStyle] = useState<FontStyleType>(initialFontStyle);

  const changeTheme = (themeName: ThemeType) => {
    setCurrentTheme(themeName);
  };

  const changeFontStyle = (fontStyle: FontStyleType) => {
    setCurrentFontStyle(fontStyle);
  };

  const activeTheme = getMergedTheme(currentTheme as keyof typeof themes, currentFontStyle as keyof typeof fontStyles);


  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, currentFontStyle, changeFontStyle }}>
      <ChakraProvider theme={activeTheme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

