"use client";

import * as React from "react";
import { Star, BrainCircuit, Forward, Badge } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { GratitudeState, Quote } from "@/lib/types";
import { PROMPTS, QUOTES, BADGES } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { suggestGratitudePrompt } from "@/ai/flows/suggest-gratitude-prompt";

import { Header } from "@/components/app/Header";
import { GratitudeCard } from "@/components/app/GratitudeCard";
import { StatsCard } from "@/components/app/StatsCard";
import { ProgressCard } from "@/components/app/ProgressCard";
import { QuoteCard } from "@/components/app/QuoteCard";
import { BadgesCard } from "@/components/app/BadgesCard";
import { Skeleton } from "@/components/ui/skeleton";

const CHALLENGE_DURATION = 30;

export default function GratitudeChallengePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [currentPrompt, setCurrentPrompt] = React.useState<string>("");
  const [currentQuote, setCurrentQuote] = React.useState<Quote | null>(null);
  const [isSuggestingPrompt, setIsSuggestingPrompt] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("gratitudeChallengeData");
      let initialState: GratitudeState;

      if (savedData) {
        const parsedData = JSON.parse(savedData) as GratitudeState;
        const today = new Date().toDateString();
        const lastEntryDate = parsedData.lastEntryDate
          ? new Date(parsedData.lastEntryDate).toDateString()
          : null;

        // Reset streak if a day was missed
        if (lastEntryDate && lastEntryDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (new Date(parsedData.lastEntryDate).toDateString() !== yesterday.toDateString()) {
                parsedData.streak = 0;
            }
        }
        initialState = parsedData;
      } else {
        initialState = {
          entries: [],
          currentDay: 1,
          streak: 0,
          points: 0,
          unlockedBadges: [],
          lastEntryDate: null,
        };
      }

      setState(initialState);
      setCurrentPrompt(PROMPTS[initialState.currentDay - 1] || PROMPTS[PROMPTS.length-1]);
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      setState({
        entries: [], currentDay: 1, streak: 0, points: 0, unlockedBadges: [], lastEntryDate: null,
      });
    }

    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (state && !isLoading) {
      try {
        localStorage.setItem("gratitudeChallengeData", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save data to local storage", error);
      }
    }
  }, [state, isLoading]);

  const handleAddEntry = (text: string) => {
    if (!text.trim() || !state) return;
    
    const today = new Date();
    const todayStr = today.toDateString();

    const lastEntryDate = state.lastEntryDate ? new Date(state.lastEntryDate).toDateString() : null;

    if (lastEntryDate === todayStr) {
      toast({
        title: "Entry already submitted",
        description: "You've already submitted your gratitude for today. Come back tomorrow!",
        variant: "destructive"
      });
      return;
    }

    const newEntry = {
      day: state.currentDay,
      date: today.toISOString(),
      text,
      prompt: currentPrompt,
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const newStreak = lastEntryDate === yesterday.toDateString() ? state.streak + 1 : 1;
    const newPoints = state.points + 10 + (newStreak > 1 ? 5 * (newStreak-1) : 0); // 10 points per entry + 5 bonus for each consecutive day
    const newCurrentDay = state.currentDay < CHALLENGE_DURATION ? state.currentDay + 1 : state.currentDay;

    const newUnlockedBadges = [...state.unlockedBadges];
    BADGES.forEach(badge => {
        const isUnlocked = badge.type === 'streak' ? newStreak >= badge.milestone : state.entries.length + 1 >= badge.milestone;
        if (isUnlocked && !newUnlockedBadges.includes(badge.id)) {
            newUnlockedBadges.push(badge.id);
            toast({
                title: "Badge Unlocked!",
                description: `You've earned the "${badge.name}" badge.`,
            });
        }
    });

    setState({
      ...state,
      entries: [...state.entries, newEntry],
      currentDay: newCurrentDay,
      streak: newStreak,
      points: newPoints,
      unlockedBadges: newUnlockedBadges,
      lastEntryDate: today.toISOString(),
    });

    toast({
        title: "Gratitude Saved!",
        description: "Your entry has been successfully saved.",
    });

    setCurrentPrompt(PROMPTS[newCurrentDay - 1] || PROMPTS[PROMPTS.length-1]);
  };

  const handleSuggestPrompt = async () => {
    if (!state || state.entries.length === 0) {
        toast({
            title: "Not enough data",
            description: "Please write a few entries first for personalized suggestions.",
            variant: "destructive"
        });
        return;
    }

    setIsSuggestingPrompt(true);
    try {
        const pastResponses = state.entries.map(e => e.text).join('\n');
        const result = await suggestGratitudePrompt({ pastResponses });
        if (result.suggestedPrompt) {
            setCurrentPrompt(result.suggestedPrompt);
            toast({ title: "New prompt suggested!", description: "Here is a personalized prompt for you."});
        }
    } catch (error) {
        console.error("Error suggesting prompt:", error);
        toast({
            title: "Suggestion failed",
            description: "Could not get an AI-powered suggestion at this time.",
            variant: "destructive"
        });
    } finally {
        setIsSuggestingPrompt(false);
    }
  };

  const handleNewQuote = () => {
    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  if (isLoading || !state) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-96 lg:col-span-2 md:row-span-2" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-64 lg:col-span-3" />
            <Skeleton className="h-64 lg:col-span-3" />
        </div>
      </main>
    );
  }

  const isTodayEntrySubmitted = state.lastEntryDate ? new Date(state.lastEntryDate).toDateString() === new Date().toDateString() : false;

  return (
    <main className="container mx-auto p-4 md:p-8">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 md:row-span-2">
                <GratitudeCard 
                    prompt={currentPrompt}
                    onEntrySubmit={handleAddEntry}
                    onSuggestPrompt={handleSuggestPrompt}
                    isSuggestingPrompt={isSuggestingPrompt}
                    isSubmittedToday={isTodayEntrySubmitted}
                    day={state.currentDay}
                />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <StatsCard icon={Star} title="Current Streak" value={`${state.streak} Days`} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <StatsCard icon={Badge} title="Total Points" value={`${state.points}`} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-3">
                <ProgressCard currentDay={state.currentDay} totalDays={CHALLENGE_DURATION} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
                <BadgesCard allBadges={BADGES} unlockedBadgeIds={state.unlockedBadges} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-3">
                {currentQuote && <QuoteCard quote={currentQuote.text} author={currentQuote.author} onNewQuote={handleNewQuote}/>}
            </motion.div>
        </div>
    </main>
  );
}
