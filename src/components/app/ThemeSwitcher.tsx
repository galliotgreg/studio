
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

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { t } = useLanguage();
  
  const themes = [
    { name: 'Clair', value: 'light', unlocked: true, unlockConditionKey: "badge.default.unlock" },
    { name: 'Sombre', value: 'dark', unlocked: true, unlockConditionKey: "badge.default.unlock" },
    { name: 'Aurore', value: 'theme-sunrise', unlocked: true, unlockConditionKey: "badge.entry-1.name" },
    { name: 'Forêt', value: 'theme-forest', unlocked: true, unlockConditionKey: "badge.streak-3.name" },
    { name: 'Océan', value: 'theme-ocean', unlocked: true, unlockConditionKey: "badge.streak-7.name" },
    { name: 'Nuit Étoilée', value: 'theme-starlight', unlocked: true, unlockConditionKey: "badge.entry-10.name" },
    { name: 'Lavande', value: 'theme-lavender', unlocked: true, unlockConditionKey: "badge.streak-21.name" },
    { name: 'Or Rose', value: 'theme-rose-gold', unlocked: true, unlockConditionKey: "badge.streak-30.name" },
    { name: 'Vieux Grimoire', value: 'theme-grimoire', unlocked: true, unlockConditionKey: "badge.streak-30.name" },
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
               <span className={cn(!item.unlocked && "text-muted-foreground")}>{t(item.name)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
