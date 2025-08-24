import type { Badge } from "./types";
import { Star, Award, Zap, Trophy, Crown, BookMarked } from "lucide-react";

export const BADGES: Badge[] = [
    { id: 'entry-1', name: "First Step", description: "Completed your first entry.", icon: Star, milestone: 1, type: 'entries'},
    { id: 'streak-3', name: "Consistent Heart", description: "Maintained a 3-day streak.", icon: Award, milestone: 3, type: 'streak'},
    { id: 'streak-7', name: "Weekly Warrior", description: "Maintained a 7-day streak.", icon: Trophy, milestone: 7, type: 'streak'},
    { id: 'entry-10', name: "Journaler", description: "Completed 10 entries.", icon: BookMarked, milestone: 10, type: 'entries'},
    { id: 'streak-21', name: "New Habit", description: "Maintained a 21-day streak.", icon: Zap, milestone: 21, type: 'streak'},
    { id: 'streak-30', name: "Gratitude Master", description: "Maintained a 30-day streak.", icon: Crown, milestone: 30, type: 'streak'},
];
