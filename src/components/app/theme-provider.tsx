"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { THEMES } from "@/lib/themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We construct the full list of themes for next-themes
  const allThemes: string[] = ['light', 'dark'];
  THEMES.forEach(theme => {
    if (theme.id !== 'default') {
      allThemes.push(`light-${theme.id}`);
      allThemes.push(`dark-${theme.id}`);
    }
  });

  return (
    <NextThemesProvider 
      {...props} 
      themes={allThemes}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
