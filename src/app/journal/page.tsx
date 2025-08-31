
"use client";

import * as React from "react";
import { ArrowLeft, BookOpen, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toPng } from 'html-to-image';

import type { GratitudeState, GratitudeEntry, Badge } from "@/lib/types";
import { BADGES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { JournalEntryCard } from "@/components/app/JournalEntryCard";
import { useLanguage } from "@/components/app/LanguageProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { WordCloudCard } from "@/components/app/WordCloudCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareImagePreviewCard } from "@/components/app/ShareImagePreviewCard";
import { useToast } from "@/hooks/use-toast";


export default function JournalPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [state, setState] = React.useState<GratitudeState | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [entryToShare, setEntryToShare] = React.useState<GratitudeEntry | null>(null);
  const imagePreviewRef = React.useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  
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

  React.useEffect(() => {
    if (state && !isLoading) {
      try {
        localStorage.setItem("gratitudeChallengeData", JSON.stringify(state));
        // Optional: Dispatch event to notify other components if needed
        window.dispatchEvent(new CustomEvent('storageUpdated'));
      } catch (error) {
        console.error("Failed to save data to local storage", error);
      }
    }
  }, [state, isLoading]);

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

  const handleShare = (entry: GratitudeEntry) => {
    setEntryToShare(entry);
  };

  const unlockShareBadge = () => {
    setState(prevState => {
        if (!prevState || prevState.unlockedBadges.includes('share-1')) {
            return prevState;
        }

        const shareBadge = BADGES.find(b => b.id === 'share-1');
        if (shareBadge) {
            const newUnlockedBadges = [...prevState.unlockedBadges, shareBadge.id];
            toast({
                title: t('badgeUnlocked'),
                description: t('badgeUnlockedDescription').replace('{badgeName}', t(shareBadge.nameKey)),
            });
            return { ...prevState, unlockedBadges: newUnlockedBadges };
        }
        return prevState;
    });
  }
  
  const handleDownloadImage = async () => {
    if (!imagePreviewRef.current || !entryToShare) return;
    setIsGeneratingImage(true);
    try {
        const fontEmbedCss = `
          @font-face {
            font-family: 'Literata';
            src: url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap');
          }
        `;
        const dataUrl = await toPng(imagePreviewRef.current, { 
            cacheBust: true, 
            pixelRatio: 2,
            fontEmbedCss: fontEmbedCss
        });
        
        const blob = await (await fetch(dataUrl)).blob();
        const fileName = `gratitude-day-${entryToShare.day}.png`;
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: t('appTitle'),
                text: `${t('dailyGratitude').replace('{day}', String(entryToShare.day))}`,
                files: [file],
            });
            unlockShareBadge(); // Unlock badge on successful share
        } else {
            // Fallback for desktop or browsers that don't support Web Share API for files
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
            unlockShareBadge(); // Unlock badge on successful download
        }
        setEntryToShare(null);
    } catch (err: any) {
        // Don't show an error if the user cancelled the share dialog
        if (err.name !== 'AbortError') {
            console.error('Failed to generate or share image', err);
            toast({
                title: t('exportErrorTitle'),
                description: t('exportErrorDescription'),
                variant: "destructive"
            });
        }
    } finally {
        setIsGeneratingImage(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-foreground">
          <BookOpen className="w-8 h-8 text-primary" />
          {t('myJournal')}
        </h1>
        <Button asChild variant="outline" className="text-foreground">
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
                        className="w-full"
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
                  <JournalEntryCard entry={entry} onShare={handleShare} />
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
       <Dialog open={!!entryToShare} onOpenChange={(open) => !open && setEntryToShare(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('shareYourGratitude')}</DialogTitle>
            <DialogDescription>
              {t('sharePreviewDescription')}
            </DialogDescription>
          </DialogHeader>
          {entryToShare && <ShareImagePreviewCard ref={imagePreviewRef} entry={entryToShare} />}
           <Button onClick={handleDownloadImage} disabled={isGeneratingImage}>
              <Share2 className="mr-2 h-4 w-4" />
              {isGeneratingImage ? t('generatingImage') : t('downloadImage')}
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
