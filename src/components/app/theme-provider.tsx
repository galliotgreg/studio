
"use client"

import * as React from "react"

type Theme = "default" | "grimoire"
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  mode: "light" | "dark" | "system"
  setMode: (mode: "light" | "dark" | "system") => void
}

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
  mode: "system",
  setMode: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "default",
  defaultMode = "system",
  storageKeyTheme = "vite-ui-theme-palette",
  storageKeyMode = "vite-ui-theme-mode",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultMode?: "light" | "dark" | "system"
  storageKeyTheme?: string
  storageKeyMode?: string
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [mode, setModeState] = React.useState<"light" | "dark" | "system">(defaultMode)

  React.useEffect(() => {
    setThemeState((localStorage.getItem(storageKeyTheme) as Theme) || defaultTheme);
    setModeState((localStorage.getItem(storageKeyMode) as "light" | "dark" | "system") || defaultMode);
  }, []);


  React.useEffect(() => {
    const root = window.document.documentElement

    // Handle mode (light/dark)
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const effectiveMode = mode === "system" ? systemMode : mode
    
    root.classList.remove("light", "dark")
    root.classList.add(effectiveMode)
    
    // Handle theme (palette)
    root.setAttribute("data-theme", theme)

  }, [theme, mode])

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKeyTheme, theme)
    setThemeState(theme)
  }
  
  const setMode = (mode: "light" | "dark" | "system") => {
    localStorage.setItem(storageKeyMode, mode)
    setModeState(mode)
  }

  const value = {
    theme,
    setTheme,
    mode,
    setMode,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
