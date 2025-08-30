
"use client"

import * as React from "react"
import { Palette, Sun, Moon, Check } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

export function ThemeSwitcher() {
  const { palette, setPalette, mode, setMode, themes } = useCustomTheme();
  const { t } = useLanguage();

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
                <Sun className={cn("h-4 w-4", mode === 'light' && "text-primary")} />
                <span className={cn("text-sm", mode === 'light' && "font-semibold")}>{t('theme.light')}</span>
            </div>
            <Switch
                checked={mode === 'dark'}
                onCheckedChange={(checked) => setMode(checked ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
            />
            <div className="flex items-center gap-2">
                <Moon className={cn("h-4 w-4", mode === 'dark' && "text-primary")} />
                <span className={cn("text-sm", mode === 'dark' && "font-semibold")}>{t('theme.dark')}</span>
            </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        
        {themes.map((theme) => {
          const isActive = theme.id === palette;
          return (
            <DropdownMenuItem
                key={theme.id}
                onClick={() => setPalette(theme.id)}
            >
              <div className="flex items-center w-full">
                <span className="flex-grow">{t(theme.nameKey)}</span>
                {isActive && <Check className="ml-2 h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          )
        })}
    </DropdownMenuContent>
    </DropdownMenu>
  )
}
