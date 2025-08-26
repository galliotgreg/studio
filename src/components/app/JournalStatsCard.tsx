
"use client";

import * as React from "react";
import { BookMarked } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/app/LanguageProvider";
import { GratitudeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JournalStatsCardProps {
  entries: GratitudeEntry[];
}

export function JournalStatsCard({ entries }: JournalStatsCardProps) {
  const { t } = useLanguage();
  const hasEntries = entries.length > 0;
  
  return (
    <Card className={cn(
        "h-full transform transition-transform duration-300",
        hasEntries && "hover:scale-[1.05] hover:shadow-xl cursor-pointer"
    )}>
        <Link href={hasEntries ? "/journal" : "#"} className={cn("block h-full", !hasEntries ? "pointer-events-none" : "")}>
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
        </Link>
    </Card>
  );
}
