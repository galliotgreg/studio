
import type { LucideIcon } from "lucide-react";

export interface Theme {
  id: string; 
  nameKey: string;
}

export const THEMES: Theme[] = [
    {
      id: 'default',
      nameKey: 'theme.modern',
    },
    {
      id: 'theme-lavande',
      nameKey: 'theme.lavande',
    },
    {
      id: 'theme-nature',
      nameKey: 'theme.nature',
    },
    {
      id: 'theme-ocean',
      nameKey: 'theme.ocean',
    },
    {
      id: 'theme-sunset',
      nameKey: 'theme.sunset',
    },
     {
      id: 'theme-grimoire',
      nameKey: 'theme.grimoire',
    },
];
