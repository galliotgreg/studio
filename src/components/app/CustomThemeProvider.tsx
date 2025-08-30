
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
  const [unlockedThemes, setUnlockedThemes] = React.useState<Theme[]>([THEMES[0]]);

  const loadData = React.useCallback(() => {
    try {
        const savedPalette = localStorage.getItem("gratitudePalette");
        if (savedPalette && THEMES.find(t => t.id === savedPalette)) {
            setPalette(savedPalette);
        }

        const savedMode = localStorage.getItem("gratitudeThemeMode") as ThemeMode;
        if (savedMode) {
            setMode(savedMode);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMode(systemPrefersDark ? 'dark' : 'light');
        }
    } catch (error) {
      console.error("Failed to load theme data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();

    window.addEventListener('storageUpdated', handleStorageUpdate);
    
    // Initial load
    handleStorageUpdate();

    return () => {
      window.removeEventListener('storageUpdated', handleStorageUpdate);
    };
  }, [loadData]);


  React.useEffect(() => {
    localStorage.setItem("gratitudePalette", palette);
    localStorage.setItem("gratitudeThemeMode", mode);

    const root = window.document.documentElement;
    
    // Remove all possible theme classes before adding the new one
    THEMES.forEach(theme => root.classList.remove(theme.id));
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
