
"use client"

import * as React from "react"
import { Lock, Unlock, Palette, Sun, Moon } from "lucide-react"
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
import { BADGES } from "@/lib/data"
import { THEMES, Theme } from "@/lib/themes"
import { Switch } from "@/components/ui/switch"
import { ThemeInfoDialog } from "./ThemeInfoDialog"

export function ThemeSwitcher() {
  const { palette, setPalette, mode, setMode, unlockedThemes, getThemeById } = useCustomTheme();
  const { t } = useLanguage();
  const [infoDialogTheme, setInfoDialogTheme] = React.useState<Theme | null>(null);

  const isDark = mode === 'dark';

  const handlePaletteChange = (newPalette: string) => {
    setPalette(newPalette);
  };
  
  const toggleBaseTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };
  
  const handleThemeClick = (item: Theme) => {
    const isUnlocked = unlockedThemes.some(ut => ut.id === item.id);
    if (isUnlocked) {
        handlePaletteChange(item.id);
    } else {
        setInfoDialogTheme(item);
    }
  };

  return (
    <>
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
              const isUnlocked = unlockedThemes.some(ut => ut.id === themeData.id);
              const isActive = themeData.id === palette;
              
              const badge = themeData.unlockBadgeId ? BADGES.find(b => b.id === themeData.unlockBadgeId) : null;
              const badgeName = badge ? t(badge.nameKey) : '';
              
              if (themeData.isTreasure && !isUnlocked) {
                return null;
              }

              return (
                <DropdownMenuItem
                    key={themeData.id}
                    onClick={() => handleThemeClick(themeData)}
                    className={cn("flex flex-col items-start gap-1 p-2 cursor-pointer", isActive && "bg-accent")}
                >
                  <div className="flex items-center w-full">
                    {isUnlocked ? (
                        <Unlock className="mr-2 h-4 w-4 text-primary" /> 
                    ) : (
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={cn(!isUnlocked && "text-muted-foreground")}>{t(themeData.nameKey)}</span>
                  </div>
                   {!isUnlocked && themeData.unlockBadgeId && (
                    <small className="text-xs text-muted-foreground ml-6">
                      {t('unlockCondition')} {badgeName}
                    </small>
                  )}
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuContent>
        </DropdownMenu>
        <ThemeInfoDialog theme={infoDialogTheme} onOpenChange={() => setInfoDialogTheme(null)} />
    </>
  )
}
