
import type { Badge } from "./types";
import { Star, Award, Zap, Trophy, Crown, BookMarked, Share2 } from "lucide-react";

export interface Theme {
  id: string; 
  nameKey: string;
  unlockBadgeId: string | null;
  isTreasure: boolean;
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    nameKey: 'theme.modern',
    unlockBadgeId: null,
    isTreasure: false,
  },
  {
    id: 'theme-nature',
    nameKey: 'theme.nature',
    unlockBadgeId: null,
    isTreasure: true,
  },
  {
    id: 'theme-ocean',
    nameKey: 'theme.ocean',
    unlockBadgeId: null,
    isTreasure: true,
  },
  {
    id: 'theme-grimoire',
    nameKey: 'theme.grimoire',
    unlockBadgeId: null,
    isTreasure: true,
  },
    {
    id: 'theme-starlight',
    nameKey: 'theme.starlight',
    unlockBadgeId: null,
    isTreasure: true,
  },
  {
    id: 'theme-lavender',
    nameKey: 'theme.lavender',
    unlockBadgeId: null,
    isTreasure: true,
  },
  {
    id: 'theme-sunset',
    nameKey: 'theme.sunset',
    unlockBadgeId: null,
    isTreasure: true,
  },
];
