
"use client"

import * as React from "react"
import { Palette, Sun, Moon } from "lucide-react"
import { useCustomTheme } from "./CustomThemeProvider";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useLanguage } from "./LanguageProvider"
import { THEMES } from "@/lib/themes"
import { Switch } from "@/components/ui/switch"

export function ThemeSwitcher() {
  const { palette, setPalette, mode, setMode } = useCustomTheme();
  const { t } = useLanguage();

  const isDark = mode === 'dark';

  const handlePaletteChange = (newPalette: string) => {
    setPalette(newPalette);
  };
  
  const toggleBaseTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
        <Palette className="h-[1.2rem] w-[1.2rem] text-foreground" />
        <span className="sr-only">{t('changeTheme')}</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2">
                <Sun className={cn("h-4 w-4", !isDark && "text-primary")} />
                <span className={cn("text-sm", !isDark && "font-semibold")}>{t('theme.light')}</span>
            </div>
            <Switch
                checked={isDark}
                onCheckedChange={toggleBaseTheme}
                aria-label="Toggle dark mode"
            />
            <div className="flex items-center gap-2">
                <Moon className={cn("h-4 w-4", isDark && "text-primary")} />
                <span className={cn("text-sm", isDark && "font-semibold")}>{t('theme.dark')}</span>
            </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        
        {THEMES.map((themeData) => {
          const isActive = themeData.id === palette;
          
          return (
            <DropdownMenuItem
                key={themeData.id}
                onClick={() => handlePaletteChange(themeData.id)}
                className={cn("flex flex-col items-start gap-1 p-2 cursor-pointer", isActive && "bg-accent")}
            >
              <div className="flex items-center w-full">
                <span>{t(themeData.nameKey)}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
    </DropdownMenuContent>
    </DropdownMenu>
  )
}
