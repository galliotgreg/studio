
"use client";

import * as React from "react";
import { Star, Badge, Settings, Trash2 } from "lucide-react";
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
import { JournalCard } from "@/components/app/JournalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/app/LanguageProvider";
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

const CHALLENGE_DURATION = 30;

export default function GratitudeChallengePage() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [currentPrompt, setCurrentPrompt] = React.useState<string>("");
  const [currentQuote, setCurrentQuote] = React.useState<Quote | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (!registration) return;
        return registration.getNotifications({includeTriggered: true});
      }).then(notifications => {
        if (notifications) {
            setNotificationsEnabled(notifications.length > 0);
        }
      }).catch(error => {
        console.error('Service Worker notifications check failed:', error);
      });
    }
  }, []);

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
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      setState({
        entries: [], currentDay: 1, streak: 0, points: 0, unlockedBadges: [], lastEntryDate: null,
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
    const newPoints = state.points + 10 + (newStreak > 1 ? 5 * (newStreak-1) : 0); // 10 points per entry + 5 bonus for each consecutive day
    const newCurrentDay = state.currentDay < CHALLENGE_DURATION ? state.currentDay + 1 : state.currentDay;

    const newUnlockedBadges = [...state.unlockedBadges];
    BADGES.forEach(badge => {
        const isUnlocked = badge.type === 'streak' ? newStreak >= badge.milestone : state.entries.length + 1 >= badge.milestone;
        if (isUnlocked && !newUnlockedBadges.includes(badge.id)) {
            newUnlockedBadges.push(badge.id);
            toast({
                title: t('badgeUnlocked'),
                description: t('badgeUnlockedDescription').replace('{badgeName}', t(badge.nameKey)),
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

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (!('serviceWorker' in navigator) || !('Notification' in window) || !('showTrigger' in Notification.prototype)) {
      toast({ title: t('notificationsNotSupportedTitle'), description: t('notificationsNotSupportedDescription'), variant: 'destructive' });
      return;
    }
  
    const registration = await navigator.serviceWorker.ready;
    const existingNotifications = await registration.getNotifications({ includeTriggered: true });
  
    // Cancel all existing notifications before setting a new one or disabling them
    existingNotifications.forEach(notification => notification.close());
    setNotificationsEnabled(false);
  
    if (enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const targetTime = new Date();
        targetTime.setHours(19, 0, 0, 0); // 7 PM
        if (targetTime.getTime() < Date.now()) {
          targetTime.setDate(targetTime.getDate() + 1); // If it's already past 7 PM, schedule for tomorrow
        }
  
        try {
          await registration.showNotification(t('appTitle'), {
            tag: 'gratitude-reminder',
            body: t('notificationBody'),
            showTrigger: new (window as any).TimestampTrigger(targetTime.getTime()),
            renotify: true,
          });
          setNotificationsEnabled(true);
          toast({ title: t('notificationsEnabledTitle'), description: t('notificationsEnabledDescription') });
        } catch (e) {
          console.error("Error showing notification:", e);
          toast({ title: t('notificationErrorTitle'), description: t('notificationErrorDescription'), variant: 'destructive' });
        }
      } else {
        toast({ title: t('notificationPermissionDeniedTitle'), description: t('notificationPermissionDeniedDescription'), variant: 'destructive' });
      }
    } else {
      toast({ title: t('notificationsDisabledTitle'), description: t('notificationsDisabledDescription') });
    }
  };


  if (isLoading || !state) {
    return (
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <Header onReset={() => setIsResetDialogOpen(true)} onShare={handleShare} onNotificationsToggle={handleNotificationsToggle} notificationsEnabled={notificationsEnabled} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-96 lg:col-span-2 md:row-span-2" />
            <div className="flex flex-col gap-6">
                <Skeleton className="h-24" />
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
        <Header onReset={() => setIsResetDialogOpen(true)} onShare={handleShare} onNotificationsToggle={handleNotificationsToggle} notificationsEnabled={notificationsEnabled} />
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatsCard icon={Badge} title={t('totalPoints')} value={`${state.points}`} />
                </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                <ProgressCard currentDay={state.currentDay} totalDays={CHALLENGE_DURATION} />
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
                <JournalCard entries={state.entries} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-3">
                <BadgesCard allBadges={BADGES} unlockedBadgeIds={state.unlockedBadges} />
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

    