
"use client";

import * as React from "react";
import { Star, Badge, Settings, Trash2, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from 'next/link';

import type { GratitudeState, Quote } from "@/lib/types";
import { BADGES } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/app/Header";
import { GratitudeCard } from "@/components/app/GratitudeCard";
import { StatsCard } from "@/components/app/StatsCard";
import { ProgressCard } from "@/components/app/ProgressCard";
import { QuoteCard } from "@/components/app/QuoteCard";
import { BadgesCard } from "@/components/app/BadgesCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/app/LanguageProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button";
import { JournalStatsCard } from "@/components/app/JournalStatsCard";

const CHALLENGE_DURATION = 30;

export default function GratitudeChallengePage() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [currentPrompt, setCurrentPrompt] = React.useState<string>("");
  const [currentQuote, setCurrentQuote] = React.useState<Quote | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const badgesCardRef = React.useRef<HTMLDivElement>(null);


  const getQuotes = React.useCallback(() => {
    try {
      return JSON.parse(t('quotesJson'));
    } catch (e) {
      return [];
    }
  }, [t]);

  const getPrompts = React.useCallback(() => {
    try {
      return JSON.parse(t('promptsJson'));
    } catch (e) {
      return [];
    }
  }, [t, language]);

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
          unlockedBadges: [],
          lastEntryDate: null,
        };
      }

      setState(initialState);
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      setState({
        entries: [], currentDay: 1, streak: 0, unlockedBadges: [], lastEntryDate: null,
      });
    }
    
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
  
  React.useEffect(() => {
    const quotes = getQuotes();
    if (quotes.length > 0) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
    if (state) {
      const prompts = getPrompts();
      if (prompts.length > 0) {
        setCurrentPrompt(prompts[state.currentDay - 1] || prompts[prompts.length - 1]);
      }
    }
  }, [state, getQuotes, getPrompts, language]);


  const handleAddEntry = (text: string) => {
    if (!text.trim() || !state) return;
    
    const today = new Date();
    const todayStr = today.toDateString();

    const lastEntryDate = state.lastEntryDate ? new Date(state.lastEntryDate).toDateString() : null;

    if (lastEntryDate === todayStr) {
      toast({
        title: t('entryAlreadySubmitted'),
        description: t('entryAlreadySubmittedDescription'),
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
    
    // Only increment day if the challenge is not complete
    const newCurrentDay = state.currentDay < CHALLENGE_DURATION ? state.currentDay + 1 : state.currentDay;

    const newUnlockedBadges = [...state.unlockedBadges];
    let hasUnlockedNewBadge = false;
    BADGES.forEach(badge => {
        const isUnlocked = badge.type === 'streak' ? newStreak >= badge.milestone : state.entries.length + 1 >= badge.milestone;
        if (isUnlocked && !newUnlockedBadges.includes(badge.id)) {
            newUnlockedBadges.push(badge.id);
            hasUnlockedNewBadge = true;
            toast({
                title: t('badgeUnlocked'),
                description: t('badgeUnlockedDescription').replace('{badgeName}', t(badge.nameKey)),
            });
        }
    });

    if(hasUnlockedNewBadge && isMobile) {
        setTimeout(() => {
            badgesCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }

    setState({
      ...state,
      entries: [...state.entries, newEntry],
      currentDay: newCurrentDay,
      streak: newStreak,
      unlockedBadges: newUnlockedBadges,
      lastEntryDate: today.toISOString(),
    });

    toast({
        title: t('gratitudeSaved'),
        description: t('gratitudeSavedDescription'),
    });
  };

  const handleNewQuote = () => {
    const quotes = getQuotes();
    if(quotes.length > 0) {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };
  
  const handleResetChallenge = () => {
    localStorage.removeItem("gratitudeChallengeData");
    window.location.reload();
  };

  const handleShare = async () => {
    const shareData = {
      title: t('appTitle'),
      text: t('appDescription'),
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: t('linkCopiedTitle'),
          description: t('linkCopiedDescription'),
        });
      } catch (copyErr) {
        toast({
          title: t('shareErrorTitle'),
          description: t('shareErrorDescription'),
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading || !state) {
    return (
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <Header onReset={() => setIsResetDialogOpen(true)} onShare={handleShare} onExport={() => {}} onImport={() => {}} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-96 lg:col-span-2 md:row-span-2" />
            <div className="flex flex-col gap-6">
                <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-48" />
            <Skeleton className="h-64 lg:col-span-3" />
            <Skeleton className="h-64 lg:col-span-3" />
        </div>
      </main>
    );
  }

  const isTodayEntrySubmitted = state.lastEntryDate ? new Date(state.lastEntryDate).toDateString() === new Date().toDateString() : false;

  return (
    <main className="container mx-auto p-4 md:p-8 flex-grow">
        <Header onReset={() => setIsResetDialogOpen(true)} onShare={handleShare} onExport={() => {}} onImport={() => {}} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 md:row-span-2">
                <GratitudeCard 
                    prompt={currentPrompt}
                    day={state.currentDay}
                    isSubmittedToday={isTodayEntrySubmitted}
                    onEntrySubmit={handleAddEntry}
                />
            </motion.div>
            
            <div className="flex flex-col gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <StatsCard icon={Star} title={t('currentStreak')} value={t('days').replace('{count}', String(state.streak))} />
                </motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <JournalStatsCard entries={state.entries} />
                </motion.div>
            </div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
                <ProgressCard currentDay={state.currentDay} totalDays={CHALLENGE_DURATION} isCompleted={isTodayEntrySubmitted}/>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-3">
                <BadgesCard ref={badgesCardRef} allBadges={BADGES} unlockedBadgeIds={state.unlockedBadges} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-3">
                {currentQuote && <QuoteCard quote={currentQuote.text} author={currentQuote.author} onNewQuote={handleNewQuote}/>}
            </motion.div>
        </div>
        <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('resetWarningTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('resetWarningDescription')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetChallenge} className={buttonVariants({ variant: "destructive" })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </main>
  );
}

    
