
"use client";

import * as React from "react";
import { BookMarked, ArrowRight } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useLanguage } from "@/components/app/LanguageProvider";
import { GratitudeEntry } from "@/lib/types";
import { Button } from "../ui/button";

interface JournalStatsCardProps {
  entries: GratitudeEntry[];
}

export function JournalStatsCard({ entries }: JournalStatsCardProps) {
  const { t } = useLanguage();
  const hasEntries = entries.length > 0;
  const entryCount = entries.length;
  
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('myJournal')}</CardTitle>
            <BookMarked className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-primary flex items-baseline gap-2">
              <span>{entryCount}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {entryCount > 1 ? t('entries') : t('entry')}
              </span>
            </div>
            {!hasEntries && (
              <p className="text-xs text-muted-foreground pt-1">
                {t('noEntriesYet')}
              </p>
            )}
        </CardContent>
        <CardFooter className="pt-0 justify-center">
            <Button asChild variant="outline" size="sm" className="w-full" disabled={!hasEntries}>
                <Link href={hasEntries ? "/journal" : "#"} className={!hasEntries ? "pointer-events-none" : ""}>
                    {t('viewJournal')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
