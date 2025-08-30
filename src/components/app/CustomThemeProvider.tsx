
"use client";

import * as React from "react";
import { THEMES, Theme } from "@/lib/themes";

type ThemeMode = 'light' | 'dark';
type Palette = string;

interface CustomThemeContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  themes: Theme[];
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = React.useState<Palette>('default');
  const [mode, setModeState] = React.useState<ThemeMode>('light');
  
  const setPalette = React.useCallback((newPalette: Palette) => {
    try {
      localStorage.setItem("gratitudePalette", newPalette);
    } catch (error) {
        console.error("Failed to save palette to local storage", error);
    }
    setPaletteState(newPalette);
  }, []);

  const setMode = React.useCallback((newMode: ThemeMode) => {
    try {
        localStorage.setItem("gratitudeThemeMode", newMode);
    } catch (error) {
        console.error("Failed to save mode to local storage", error);
    }
    setModeState(newMode);
  }, []);


  React.useEffect(() => {
    try {
        const savedPalette = localStorage.getItem("gratitudePalette");
        if (savedPalette && THEMES.find(t => t.id === savedPalette)) {
            setPaletteState(savedPalette);
        }

        const savedMode = localStorage.getItem("gratitudeThemeMode") as ThemeMode;
        if (savedMode) {
            setModeState(savedMode);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setModeState(systemPrefersDark ? 'dark' : 'light');
        }
    } catch (error) {
      console.error("Failed to load theme data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all possible theme classes before adding the new one
    THEMES.forEach(theme => {
        if(theme.id !== 'default') {
           root.classList.remove(theme.id)
        }
    });
    root.classList.remove('light', 'dark');

    root.classList.add(mode);
    if (palette !== 'default') {
      root.classList.add(palette);
    }
  }, [palette, mode]);

  const value = {
    palette,
    setPalette,
    mode,
    setMode,
    themes: THEMES,
  };

  return (
    <CustomThemeContext.Provider value={value}>
      {children}
    </CustomThemeContext.Provider>
  );
}

export const useCustomTheme = (): CustomThemeContextType => {
  const context = React.useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
};
