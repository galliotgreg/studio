
"use client";

import * as React from "react";
import { BookMarked, ArrowRight } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JournalEntryCard } from "@/components/app/JournalEntryCard";
import { useLanguage } from "@/components/app/LanguageProvider";
import { GratitudeEntry } from "@/lib/types";

interface JournalCardProps {
  entries: GratitudeEntry[];
}

export function JournalCard({ entries }: JournalCardProps) {
  const { t } = useLanguage();
  const recentEntries = [...entries].sort((a, b) => b.day - a.day).slice(0, 3);
  
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="text-primary" />
          <span>{t('recentEntries')}</span>
        </CardTitle>
        <CardDescription>
          {t('recentEntriesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentEntries.length > 0 ? (
           <div className="space-y-4">
            {recentEntries.map((entry) => (
                <JournalEntryCard key={entry.day} entry={entry} />
            ))}
           </div>
        ) : (
            <p className="text-muted-foreground">{t('noEntriesYet')}</p>
        )}
      </CardContent>
      {entries.length > 3 &&
        <CardFooter className="justify-end">
            <Button asChild variant="outline">
                <Link href="/journal">
                    {t('viewAll')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
      }
    </Card>
  );
}
