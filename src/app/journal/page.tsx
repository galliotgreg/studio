
"use client";

import * as React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import type { GratitudeState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { JournalEntryCard } from "@/components/app/JournalEntryCard";
import { useLanguage } from "@/components/app/LanguageProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalPage() {
  const { t } = useLanguage();
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("gratitudeChallengeData");
      if (savedData) {
        setState(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
    setIsLoading(false);
  }, []);
  
  if (isLoading || !state) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex items-center justify-between mb-8">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-10 w-24" />
            </header>
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    )
  }

  const sortedEntries = [...state.entries].sort((a, b) => b.day - a.day);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          {t('myJournal')}
        </h1>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToChallenge')}
          </Link>
        </Button>
      </header>

      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry, index) => (
            <motion.div
                key={entry.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <JournalEntryCard entry={entry} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p>{t('noEntries')}</p>
        </div>
      )}
    </div>
  );
}
