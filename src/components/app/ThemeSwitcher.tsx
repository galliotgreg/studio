
"use client"

import * as React from "react"
import { Lock, Unlock, Palette, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

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
import type { GratitudeState } from "@/lib/types"
import { BADGES } from "@/lib/data"
import { THEMES, type Theme } from "@/lib/themes"
import { Switch } from "@/components/ui/switch"
import { ThemeInfoDialog } from "./ThemeInfoDialog"


export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { t } = useLanguage();
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);
  const [currentThemeClass, setCurrentThemeClass] = React.useState('');
  const [infoDialogTheme, setInfoDialogTheme] = React.useState<Theme | null>(null);

  const isDark = resolvedTheme === 'dark';

  const loadData = React.useCallback(() => {
    try {
      const savedData = localStorage.getItem("gratitudeChallengeData");
      if (savedData) {
        const parsedData = JSON.parse(savedData) as GratitudeState;
        setUnlockedBadges(parsedData.unlockedBadges || []);
      }
      
      const themeClass = document.documentElement.className
        .split(' ')
        .find(c => c.startsWith('theme-'));
      setCurrentThemeClass(themeClass || 'default');

    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('storageUpdated', handleStorageUpdate);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const themeClass = (mutation.target as HTMLElement).className
                    .split(' ')
                    .find(c => c.startsWith('theme-'));
                setCurrentThemeClass(themeClass || 'default');
            }
        });
    });

    observer.observe(document.documentElement, {
      attributes: true
    });
    
    return () => {
        window.removeEventListener('storageUpdated', handleStorageUpdate);
        observer.disconnect();
    }
  }, [loadData]);
  
  const handlePaletteChange = (newPalette: string) => {
    if (newPalette === 'default') {
      const baseTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(baseTheme);
    } else {
      setTheme(newPalette);
    }
  };
  
  const toggleBaseTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    // We get the custom theme class if it exists
    const customThemeClass = Array.from(document.documentElement.classList).find(c => c.startsWith('theme-'));
    
    if (isCurrentlyDark) {
      // If we are on a custom theme, stay on it but in light mode
      if (customThemeClass) {
        setTheme(customThemeClass);
      } else {
        setTheme('light');
      }
    } else {
      // If we are on a custom theme, stay on it but in dark mode
      if (customThemeClass) {
        setTheme(customThemeClass);
      } else {
        setTheme('dark');
      }
    }
  };
  
  const handleThemeClick = (item: Theme) => {
    const isUnlocked = !item.unlockBadgeId || unlockedBadges.includes(item.unlockBadgeId);
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
            <Palette className="h-[1.2rem] w-[1.2rem]" />
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
            
            {THEMES.map((item) => {
              const isUnlocked = !item.unlockBadgeId || unlockedBadges.includes(item.unlockBadgeId);
              const isActive = item.id === currentThemeClass;
              
              const badge = item.unlockBadgeId ? BADGES.find(b => b.id === item.unlockBadgeId) : null;
              const badgeName = badge ? t(badge.nameKey) : '';
              
              if (item.isTreasure && !isUnlocked) {
                return null;
              }

              return (
                <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleThemeClick(item)}
                    className={cn("flex flex-col items-start gap-1 p-2 cursor-pointer", isActive && "bg-accent")}
                >
                  <div className="flex items-center w-full">
                    {isUnlocked ? (
                        <Unlock className="mr-2 h-4 w-4 text-primary" /> 
                    ) : (
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={cn(!isUnlocked && "text-muted-foreground")}>{t(item.nameKey)}</span>
                  </div>
                   {!isUnlocked && item.unlockBadgeId && (
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
