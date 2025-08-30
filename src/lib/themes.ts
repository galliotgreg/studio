
import type { Badge } from "./types";
import { Star, Award, Zap, Trophy, Crown, BookMarked, Share2 } from "lucide-react";

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
];

