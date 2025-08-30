
"use client"

import * as React from "react"
import { Palette, Sun, Moon, Check } from "lucide-react"

import { useTheme } from "@/components/app/theme-provider";
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
import { useLanguage } from "./LanguageProvider"
import { THEMES } from "@/lib/themes";

export function ThemeSwitcher() {
  const { mode, setMode, theme, setTheme } = useTheme()
  const { t } = useLanguage();
  
  // The effective mode takes into account the system preference if mode is 'system'
  const [effectiveMode, setEffectiveMode] = React.useState(mode);

  React.useEffect(() => {
    if (mode === 'system') {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setEffectiveMode(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => setEffectiveMode(mediaQuery.matches ? "dark" : "light");
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveMode(mode);
    }
  }, [mode]);

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
            <Sun className={cn("h-4 w-4", effectiveMode === 'light' && "text-primary")} />
            <span className={cn("text-sm", effectiveMode === 'light' && "font-semibold")}>{t('theme.light')}</span>
          </div>
          <Switch
            checked={effectiveMode === 'dark'}
            onCheckedChange={(checked) => setMode(checked ? 'dark' : 'light')}
            aria-label="Toggle dark mode"
          />
          <div className="flex items-center gap-2">
            <Moon className={cn("h-4 w-4", effectiveMode === 'dark' && "text-primary")} />
            <span className={cn("text-sm", effectiveMode === 'dark' && "font-semibold")}>{t('theme.dark')}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        
        {THEMES.map((themeOption) => {
          const isActive = theme === themeOption.id;
          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as 'default' | 'grimoire')}
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
