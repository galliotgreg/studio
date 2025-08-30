
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
    id: 'theme-lavender',
    nameKey: 'theme.lavender',
    unlockBadgeId: 'entry-1',
    isTreasure: false,
  },
  {
    id: 'theme-nature',
    nameKey: 'theme.nature',
    unlockBadgeId: 'streak-3',
    isTreasure: false,
  },
  {
    id: 'theme-ocean',
    nameKey: 'theme.ocean',
    unlockBadgeId: 'streak-7',
    isTreasure: false,
  },
  {
    id: 'theme-starlight',
    nameKey: 'theme.starlight',
    unlockBadgeId: 'entry-10',
    isTreasure: false,
  },
  {
    id: 'theme-sunset',
    nameKey: 'theme.sunset',
    unlockBadgeId: 'streak-30',
    isTreasure: false,
  },
  {
    id: 'theme-grimoire',
    nameKey: 'theme.grimoire',
    unlockBadgeId: 'share-1',
    isTreasure: true,
  },
];
