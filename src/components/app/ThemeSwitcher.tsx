
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Palette, Sun, Moon, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { THEMES } from "@/lib/themes"
import { useLanguage } from "./LanguageProvider"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage();

  const handleModeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };
  
  // This combines the base theme (light/dark) with the palette
  const handlePaletteChange = (newPalette: string) => {
    // We get the base mode (light or dark) from the currently resolved theme
    const baseMode = resolvedTheme?.includes('dark') ? 'dark' : 'light';
    
    // If the new palette is 'default', we just set it to the base mode
    if (newPalette === 'default') {
      setTheme(baseMode);
    } else {
      // Otherwise, we construct the theme string e.g., "dark-grimoire"
      // next-themes will handle this by applying both .dark and [data-theme=grimoire]
      setTheme(`${baseMode}-${newPalette}`);
    }
  };
  
  // We need to figure out the current palette from the potentially combined theme string
  const currentPalette = theme?.includes('-') ? theme.split('-')[1] : 'default';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] text-foreground" />
          <span className="sr-only">{t('changeTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2">
            <Sun className={cn("h-4 w-4", resolvedTheme === 'light' && "text-primary")} />
            <span className={cn("text-sm", resolvedTheme === 'light' && "font-semibold")}>{t('theme.light')}</span>
          </div>
          <Switch
            checked={resolvedTheme === 'dark'}
            onCheckedChange={handleModeChange}
            aria-label="Toggle dark mode"
          />
          <div className="flex items-center gap-2">
            <Moon className={cn("h-4 w-4", resolvedTheme === 'dark' && "text-primary")} />
            <span className={cn("text-sm", resolvedTheme === 'dark' && "font-semibold")}>{t('theme.dark')}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        
        {THEMES.map((themeOption) => {
          const isActive = themeOption.id === currentPalette;
          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => handlePaletteChange(themeOption.id)}
            >
              <div className="flex items-center w-full">
                <span className="flex-grow">{t(themeOption.nameKey)}</span>
                {isActive && <Check className="ml-2 h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}