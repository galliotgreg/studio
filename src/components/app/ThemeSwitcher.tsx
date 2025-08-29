
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
import { GratitudeState } from "@/lib/types"
import { BADGES } from "@/lib/data"

// This function determines which themes are unlocked based on the user's badges.
const getUnlockedThemes = (unlockedBadgeIds: string[] | undefined) => {
    const unlocked = new Set<string>(['light', 'dark']);
    if (!unlockedBadgeIds) return unlocked;

    if (unlockedBadgeIds.includes('entry-1')) unlocked.add('theme-sunrise');
    if (unlockedBadgeIds.includes('streak-3')) unlocked.add('theme-forest');
    if (unlockedBadgeIds.includes('streak-7')) unlocked.add('theme-ocean');
    if (unlockedBadgeIds.includes('entry-10')) unlocked.add('theme-starlight');
    if (unlockedBadgeIds.includes('streak-21')) unlocked.add('theme-lavender');
    if (unlockedBadgeIds.includes('streak-30')) unlocked.add('theme-rose-gold');

    return unlocked;
}

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage();
  const [state, setState] = React.useState<GratitudeState | null>(null);

  React.useEffect(() => {
    // This component now needs to read from localStorage to get the user's state
    const savedData = localStorage.getItem("gratitudeChallengeData");
    if (savedData) {
      setState(JSON.parse(savedData));
    }
  }, []);
  
  const unlockedThemes = getUnlockedThemes(state?.unlockedBadges);

  const themes = [
    { name: 'Clair', value: 'light', unlocked: true, unlockConditionKey: "badge.default.unlock" },
    { name: 'Sombre', value: 'dark', unlocked: true, unlockConditionKey: "badge.default.unlock" },
    { name: 'Aurore', value: 'theme-sunrise', unlocked: unlockedThemes.has('theme-sunrise'), unlockConditionKey: "badge.entry-1.name" },
    { name: 'Forêt', value: 'theme-forest', unlocked: unlockedThemes.has('theme-forest'), unlockConditionKey: "badge.streak-3.name" },
    { name: 'Océan', value: 'theme-ocean', unlocked: unlockedThemes.has('theme-ocean'), unlockConditionKey: "badge.streak-7.name" },
    { name: 'Nuit Étoilée', value: 'theme-starlight', unlocked: unlockedThemes.has('theme-starlight'), unlockConditionKey: "badge.entry-10.name" },
    { name: 'Lavande', value: 'theme-lavender', unlocked: unlockedThemes.has('theme-lavender'), unlockConditionKey: "badge.streak-21.name" },
    { name: 'Or Rose', value: 'theme-rose-gold', unlocked: unlockedThemes.has('theme-rose-gold'), unlockConditionKey: "badge.streak-30.name" },
  ]

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
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            disabled={!item.unlocked}
            onClick={() => item.unlocked && setTheme(item.value)}
            className={cn("flex flex-col items-start gap-1 p-2", theme === item.value && "bg-accent")}
          >
            <div className="flex items-center w-full">
               {item.unlocked ? <Unlock className="mr-2 h-4 w-4 text-primary" /> : <Lock className="mr-2 h-4 w-4 text-muted-foreground" />}
               <span className={cn(!item.unlocked && "text-muted-foreground")}>{item.name}</span>
            </div>
            {!item.unlocked && (
                <small className="text-xs text-muted-foreground pl-6">{t('unlockCondition')} {t(item.unlockConditionKey)}</small>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
