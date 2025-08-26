
"use client";

import * as React from "react";
import { BookMarked, ArrowRight } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/app/LanguageProvider";
import { GratitudeEntry } from "@/lib/types";

interface JournalStatsCardProps {
  entries: GratitudeEntry[];
}

export function JournalStatsCard({ entries }: JournalStatsCardProps) {
  const { t } = useLanguage();
  const hasEntries = entries.length > 0;
  
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('myJournal')}</CardTitle>
            <BookMarked className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold text-primary">{entries.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
                {hasEntries ? t('viewJournal') : t('noEntriesYet')}
            </p>
        </CardContent>
    </Card>
  );
}
