
"use client";

import * as React from "react";
import { BookMarked, ArrowRight } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('myJournal')}</CardTitle>
            <BookMarked className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="flex-grow">
            <div className="text-4xl font-bold text-primary">{entries.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
                {t('viewAllEntries').replace('{count}', String(entries.length))}
            </p>
        </CardContent>
        <CardFooter>
            {hasEntries ? (
                <Button asChild className="w-full" variant="outline">
                    <Link href="/journal">
                        {t('viewJournal')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            ) : (
                <Button className="w-full" variant="outline" disabled>
                    {t('noEntriesYet')}
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}
