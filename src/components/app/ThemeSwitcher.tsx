
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
import { Switch } from "@/components/ui/switch"


export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { t } = useLanguage();
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);
  
  const isDark = resolvedTheme === 'dark';

  const loadBadges = React.useCallback(() => {
    try {
      const savedData = localStorage.getItem("gratitudeChallengeData");
      if (savedData) {
        const parsedData = JSON.parse(savedData) as GratitudeState;
        setUnlockedBadges(parsedData.unlockedBadges || []);
      }
    } catch (error) {
      console.error("Failed to load badge data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    loadBadges();

    const handleStorageUpdate = () => {
      loadBadges();
    };
    
    window.addEventListener('storageUpdated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storageUpdated', handleStorageUpdate);
    };
  }, [loadBadges]);
  
  const themes = [
    { nameKey: 'theme.default', value: isDark ? 'dark' : 'light', unlockBadgeId: null },
    { nameKey: 'theme.sunrise', value: 'theme-sunrise', unlockBadgeId: 'entry-1' },
    { nameKey: 'theme.forest', value: 'theme-forest', unlockBadgeId: 'streak-3' },
    { nameKey: 'theme.ocean', value: 'theme-ocean', unlockBadgeId: 'streak-7' },
    { nameKey: 'theme.starlight', value: 'theme-starlight', unlockBadgeId: 'entry-10' },
    { nameKey: 'theme.lavender', value: 'theme-lavender', unlockBadgeId: 'streak-21' },
    { nameKey: 'theme.grimoire', value: 'theme-grimoire', unlockBadgeId: 'share-1' },
    { nameKey: 'theme.rose-gold', value: 'themerosegold', unlockBadgeId: 'streak-30' },
  ]

  const getBadgeName = (badgeId: string | null) => {
    if (!badgeId) return "";
    const badge = BADGES.find(b => b.id === badgeId);
    return badge ? t(badge.nameKey) : '';
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('changeTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2">
                <Sun className={cn("h-4 w-4", !isDark && "text-primary")} />
                <span className={cn("text-sm", !isDark && "font-semibold")}>{t('theme.light')}</span>
            </div>
            <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
            />
             <div className="flex items-center gap-2">
                <Moon className={cn("h-4 w-4", isDark && "text-primary")} />
                 <span className={cn("text-sm", isDark && "font-semibold")}>{t('theme.dark')}</span>
            </div>
        </div>
        <DropdownMenuSeparator />
        {themes.map((item) => {
          const isUnlocked = !item.unlockBadgeId || unlockedBadges.includes(item.unlockBadgeId);
          const isCurrentTheme = item.value === 'light' || item.value === 'dark' 
            ? theme === 'light' || theme === 'dark' || theme === 'system'
            : theme === item.value;

          return (
          <DropdownMenuItem
            key={item.value}
            disabled={!isUnlocked}
            onClick={() => isUnlocked && handleThemeChange(item.value)}
            className={cn("flex flex-col items-start gap-1 p-2", isCurrentTheme && "bg-accent")}
          >
            <div className="flex items-center w-full">
               {isUnlocked ? <Unlock className="mr-2 h-4 w-4 text-primary" /> : <Lock className="mr-2 h-4 w-4 text-muted-foreground" />}
               <span className={cn(!isUnlocked && "text-muted-foreground")}>{t(item.nameKey)}</span>
            </div>
            {!isUnlocked && (
              <small className="text-xs text-muted-foreground ml-6">
                {t('unlockCondition')} {getBadgeName(item.unlockBadgeId)}
              </small>
            )}
          </DropdownMenuItem>
        )})}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
