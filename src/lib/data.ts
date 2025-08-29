import type { Badge } from "./types";
import { Star, Award, Zap, Trophy, Crown, BookMarked, Share2 } from "lucide-react";

export const BADGES: Badge[] = [
    { id: 'entry-1', nameKey: "badge.entry-1.name", descriptionKey: "badge.entry-1.description", icon: Star, milestone: 1, type: 'entries'},
    { id: 'streak-3', nameKey: "badge.streak-3.name", descriptionKey: "badge.streak-3.description", icon: Award, milestone: 3, type: 'streak'},
    { id: 'streak-7', nameKey: "badge.streak-7.name", descriptionKey: "badge.streak-7.description", icon: Trophy, milestone: 7, type: 'streak'},
    { id: 'entry-10', nameKey: "badge.entry-10.name", descriptionKey: "badge.entry-10.description", icon: BookMarked, milestone: 10, type: 'entries'},
    { id: 'streak-21', nameKey: "badge.streak-21.name", descriptionKey: "badge.streak-21.description", icon: Zap, milestone: 21, type: 'streak'},
    { id: 'share-1', nameKey: "badge.share-1.name", descriptionKey: "badge.share-1.description", icon: Share2, milestone: 1, type: 'share'},
    { id: 'streak-30', nameKey: "badge.streak-30.name", descriptionKey: "badge.streak-30.description", icon: Crown, milestone: 30, type: 'streak'},
];
