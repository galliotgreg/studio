
"use client"

import * as React from "react"
import { Lock, Unlock, Palette } from "lucide-react"
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


export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage();
  const [unlockedBadges, setUnlockedBadges] = React.useState<string[]>([]);

  React.useEffect(() => {
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
  
  const themes = [
    { name: 'Clair', value: 'light', unlockBadgeId: null },
    { name: 'Sombre', value: 'dark', unlockBadgeId: null },
    { name: 'Aurore', value: 'theme-sunrise', unlockBadgeId: 'entry-1' },
    { name: 'Forêt', value: 'theme-forest', unlockBadgeId: 'streak-3' },
    { name: 'Océan', value: 'theme-ocean', unlockBadgeId: 'streak-7' },
    { name: 'Nuit Étoilée', value: 'theme-starlight', unlockBadgeId: 'entry-10' },
    { name: 'Lavande', value: 'theme-lavender', unlockBadgeId: 'streak-21' },
    { name: 'Vieux Grimoire', value: 'theme-grimoire', unlockBadgeId: 'share-1' },
    { name: 'Or Rose', value: 'theme-rose-gold', unlockBadgeId: 'streak-30' },
  ]

  const getBadgeName = (badgeId: string | null) => {
    if (!badgeId) return t("badge.default.unlock");
    const badge = BADGES.find(b => b.id === badgeId);
    return badge ? t(badge.nameKey) : '';
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t('themes')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((item) => {
          const isUnlocked = !item.unlockBadgeId || unlockedBadges.includes(item.unlockBadgeId);
          return (
          <DropdownMenuItem
            key={item.value}
            disabled={!isUnlocked}
            onClick={() => isUnlocked && setTheme(item.value)}
            className={cn("flex flex-col items-start gap-1 p-2", theme === item.value && "bg-accent")}
          >
            <div className="flex items-center w-full">
               {isUnlocked ? <Unlock className="mr-2 h-4 w-4 text-primary" /> : <Lock className="mr-2 h-4 w-4 text-muted-foreground" />}
               <span className={cn(!isUnlocked && "text-muted-foreground")}>{t(item.name)}</span>
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
