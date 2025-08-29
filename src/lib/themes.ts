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
    nameKey: 'theme.default',
    unlockBadgeId: null,
    isTreasure: false,
  },
  {
    id: 'theme-grimoire',
    nameKey: 'theme.grimoire',
    unlockBadgeId: 'share-1',
    isTreasure: true,
  }
];
