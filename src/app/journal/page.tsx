
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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { WordCloudCard } from "@/components/app/WordCloudCard";


export default function JournalPage() {
  const { t } = useLanguage();
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  
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

  const entryDates = React.useMemo(() => {
    if (!state) return [];
    return state.entries.map(entry => new Date(entry.date));
  }, [state]);


  if (isLoading || !state) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex items-center justify-between mb-8">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-10 w-24" />
            </header>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Skeleton className="h-80 w-full mb-8" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    )
  }

  const sortedEntries = [...state.entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const filteredEntries = selectedDate
    ? sortedEntries.filter(entry => new Date(entry.date).toDateString() === selectedDate.toDateString())
    : sortedEntries;


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

      <div className="grid md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-8">
            <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={{ entered: entryDates }}
                        modifiersClassNames={{
                            entered: "bg-primary/20 text-primary-foreground rounded-full",
                        }}
                        className="p-0"
                    />
                </CardContent>
            </Card>
            {selectedDate && (
                <Button variant="outline" onClick={() => setSelectedDate(undefined)} className="w-full">
                    {t('viewAll')}
                </Button>
            )}
             <WordCloudCard entries={state.entries} />
        </aside>
        <main className="md:col-span-2">
          {filteredEntries.length > 0 ? (
            <div data-testid="timeline" className="relative border-l-2 border-primary/20 pl-8 space-y-10">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.day}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  layout
                  className="relative"
                >
                  <span className="absolute -left-[45px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold ring-8 ring-background">
                    {entry.day}
                  </span>
                  <JournalEntryCard entry={entry} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>{selectedDate ? t('noEntriesForDate') : t('noEntries')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
