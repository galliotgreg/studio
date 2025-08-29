
"use client";

import * as React from "react";
import { THEMES, Theme } from "@/lib/themes";
import type { GratitudeState } from "@/lib/types";

type ThemeMode = 'light' | 'dark';
type Palette = string;

interface CustomThemeContextType {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  unlockedThemes: Theme[];
  getThemeById: (id: string) => Theme | undefined;
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = React.useState<Palette>('theme-grimoire');
  const [mode, setMode] = React.useState<ThemeMode>('light');
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);

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
            // Fallback to system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMode(systemPrefersDark ? 'dark' : 'light');
        }

        const savedData = localStorage.getItem("gratitudeChallengeData");
        if (savedData) {
            const parsedData = JSON.parse(savedData) as GratitudeState;
            setUnlockedBadges(parsedData.unlockedBadges || []);
        }
    } catch (error) {
      console.error("Failed to load theme data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    window.addEventListener('storageUpdated', loadData);
    return () => window.removeEventListener('storageUpdated', loadData);
  }, [loadData]);


  React.useEffect(() => {
    localStorage.setItem("gratitudePalette", palette);
    localStorage.setItem("gratitudeThemeMode", mode);

    const root = window.document.documentElement;
    
    // Remove all theme classes first
    THEMES.forEach(theme => root.classList.remove(theme.id));
    root.classList.remove('light', 'dark');

    // Add the current classes
    root.classList.add(mode);
    if (palette !== 'default') {
      root.classList.add(palette);
    }
  }, [palette, mode]);
  
  const unlockedThemes = React.useMemo(() => 
    THEMES.filter(theme => !theme.unlockBadgeId || unlockedBadges.includes(theme.unlockBadgeId)),
    [unlockedBadges]
  );
  
  const getThemeById = (id: string) => THEMES.find(t => t.id === id);


  const value = {
    palette,
    setPalette,
    mode,
    setMode,
    unlockedThemes,
    getThemeById,
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
