
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
  const [palette, setPalette] = React.useState<Palette>('default');
  const [mode, setMode] = React.useState<ThemeMode>('light');
  
  React.useEffect(() => {
    const savedPalette = localStorage.getItem("gratitudePalette") || 'default';
    const savedMode = localStorage.getItem("gratitudeThemeMode") as ThemeMode;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (THEMES.find(t => t.id === savedPalette)) {
        setPalette(savedPalette);
    }
    
    setMode(savedMode || (systemPrefersDark ? 'dark' : 'light'));
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear all theme classes
    THEMES.forEach(t => {
      if (t.id !== 'default') {
        root.classList.remove(t.id);
      }
    });

    root.classList.remove('light', 'dark');
    root.classList.add(mode);

    if (palette !== 'default') {
      root.classList.add(palette);
    }
    
    localStorage.setItem("gratitudePalette", palette);
    localStorage.setItem("gratitudeThemeMode", mode);

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
