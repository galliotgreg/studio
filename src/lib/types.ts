import type { LucideIcon } from "lucide-react";

export interface GratitudeEntry {
  day: number;
  date: string;
  text: string;
  prompt: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface Badge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  milestone: number;
  type: "streak" | "entries";
}

export interface GratitudeState {
  entries: GratitudeEntry[];
  currentDay: number;
  streak: number;
  points: number;
  unlockedBadges: string[];
  lastEntryDate: string | null;
}

declare global {
    interface Window {
        TimestampTrigger: any;
    }
    interface NotificationOptions {
        showTrigger?: any;
        renotify?: boolean;
    }
}
