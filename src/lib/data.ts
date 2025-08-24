import type { Quote, Badge } from "./types";
import { Star, Award, Zap, Trophy, Crown, BrainCircuit } from "lucide-react";

export const PROMPTS: string[] = [
    "What's one small thing that brought you joy today?",
    "Who is someone you're grateful for and why?",
    "Describe a simple pleasure you enjoyed this week.",
    "What is a skill you have that you are thankful for?",
    "Think about a challenge you overcame. What are you grateful for from that experience?",
    "What is something beautiful you saw recently?",
    "What aspect of your home are you most grateful for?",
    "What is a piece of technology you're grateful for?",
    "What food are you most grateful for today?",
    "Think of a friend. What is one quality you love about them?",
    "What part of nature are you most grateful for?",
    "What is a book or movie that you're grateful to have experienced?",
    "What tradition in your life are you grateful for?",
    "What is a sound you love hearing?",
    "What is an accomplishment, big or small, that you're proud of?",
    "Who taught you something important that you're grateful for?",
    "What is something about your community you're grateful for?",
    "What is a simple comfort you are grateful for?",
    "What memory are you feeling grateful for today?",
    "What part of your daily routine do you appreciate the most?",
    "What is a piece of art (music, painting, etc.) that you're grateful for?",
    "What is an opportunity you've been given that you're thankful for?",
    "What is something you own that you are grateful for?",
    "Who made you laugh recently? Why are you grateful for them?",
    "What is a personal strength you are grateful to have?",
    "What is something you are looking forward to?",
    "What is a lesson you've learned recently?",
    "What is a place you've visited that you're grateful to have seen?",
    "What is a kindness someone showed you recently?",
    "Looking back on this challenge, what are you most grateful for?",
];

export const QUOTES: Quote[] = [
    { text: "Gratitude turns what we have into enough.", author: "Aesop" },
    { text: "The root of joy is gratefulness.", author: "David Steindl-Rast" },
    { text: "Gratitude is the healthiest of all human emotions. The more you express gratitude for what you have, the more likely you will have even more to express gratitude for.", author: "Zig Ziglar" },
    { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus" },
    { text: "Wear gratitude like a cloak, and it will feed every corner of your life.", author: "Rumi" },
    { text: "When we focus on our gratitude, the tide of disappointment goes out and the tide of love rushes in.", author: "Kristin Armstrong" },
    { text: "Acknowledging the good that you already have in your life is the foundation for all abundance.", author: "Eckhart Tolle" },
];

export const BADGES: Badge[] = [
    { id: 'entry-1', name: "First Step", description: "Completed your first entry.", icon: Star, milestone: 1, type: 'entries'},
    { id: 'streak-3', name: "Consistent Heart", description: "Maintained a 3-day streak.", icon: Award, milestone: 3, type: 'streak'},
    { id: 'streak-7', name: "Weekly Warrior", description: "Maintained a 7-day streak.", icon: Trophy, milestone: 7, type: 'streak'},
    { id: 'entry-10', name: "Journaler", description: "Completed 10 entries.", icon: BrainCircuit, milestone: 10, type: 'entries'},
    { id: 'streak-21', name: "New Habit", description: "Maintained a 21-day streak.", icon: Zap, milestone: 21, type: 'streak'},
    { id: 'streak-30', name: "Gratitude Master", description: "Maintained a 30-day streak.", icon: Crown, milestone: 30, type: 'streak'},
];
