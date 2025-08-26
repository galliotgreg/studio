
"use client";

import * as React from "react";
import { BookMarked, ArrowRight, BookOpen } from "lucide-react";
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/app/LanguageProvider";
import { GratitudeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  entries: GratitudeEntry[];
}

export function JournalCard({ entries }: JournalCardProps) {
  const { t } = useLanguage();
  const hasEntries = entries.length > 0;
  
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="text-primary" />
          <span>{t('myJournal')}</span>
        </CardTitle>
        <CardDescription>
          {t('recentEntriesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
        {hasEntries ? (
          <>
            <BookOpen className="w-16 h-16 text-primary/20 mb-4" />
            <p className="text-4xl font-bold">{entries.length}</p>
            <p className="text-muted-foreground mt-1">{t('viewAllEntries').replace('{count}', '')}</p>
          </>
        ) : (
            <div className="text-center text-muted-foreground py-8">
                <BookOpen className="w-16 h-16 mx-auto text-primary/20 mb-4" />
                <p>{t('noEntriesYet')}</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        {hasEntries ? (
          <Link href="/journal" className={cn(buttonVariants({ variant: "outline" }))}>
            {t('viewJournal')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <Button variant="outline" disabled>
            {t('viewJournal')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
