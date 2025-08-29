
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
import { cn } from "@/lib/utils";
import { useLanguage } from "./LanguageProvider"
import { GratitudeState } from "@/lib/types"
import { BADGES } from "@/lib/data"

// MOCKUP: In a real implementation, this would come from the user's state.
const MOCK_UNLOCKED_BADGE_IDS = ['entry-1', 'streak-3'];
const MOCK_POINTS = 150;

const getUnlockedThemes = (state: GratitudeState | null) => {
    // For mockup purposes, we'll use a simplified logic
    // In a real implementation, this would check against the user's actual state
    const unlocked = new Set<string>(['light', 'dark', 'system']);
    if (MOCK_UNLOCKED_BADGE_IDS.includes('streak-7')) {
        unlocked.add('theme-forest');
    }
    if (MOCK_POINTS >= 500) {
        unlocked.add('theme-starlight');
    }
    return unlocked;
}


export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage();
  
  // MOCKUP: In a real app, we'd get the real state.
  // For now, we pass null to get our mocked data.
  const unlockedThemes = getUnlockedThemes(null);

  const themes = [
    { name: 'Clair', value: 'light', unlocked: true, unlockCondition: "Disponible par défaut" },
    { name: 'Sombre', value: 'dark', unlocked: true, unlockCondition: "Disponible par défaut" },
    { name: 'Système', value: 'system', unlocked: true, unlockCondition: "Disponible par défaut" },
    { name: 'Forêt', value: 'theme-forest', unlocked: unlockedThemes.has('theme-forest'), unlockCondition: "Obtenir le badge 'Guerrier de la Semaine' (série de 7 jours)." },
    { name: 'Nuit Étoilée', value: 'theme-starlight', unlocked: unlockedThemes.has('theme-starlight'), unlockCondition: "Atteindre 500 points de gratitude." },
    { name: 'Mystère', value: 'theme-mystery', unlocked: false, unlockCondition: "Condition de déblocage secrète..." },
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
        <DropdownMenuLabel>Thèmes</DropdownMenuLabel>
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
                <small className="text-xs text-muted-foreground pl-6">{item.unlockCondition}</small>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
