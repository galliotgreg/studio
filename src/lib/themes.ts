
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
      id: 'theme-grimoire',
      nameKey: 'theme.grimoire',
    },
];
