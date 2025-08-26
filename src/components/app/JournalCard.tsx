
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
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="text-primary" />
          <span>{t('myJournal')}</span>
        </CardTitle>
        <CardDescription>
          {t('recentEntriesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasEntries ? (
           <p className="text-muted-foreground">{t('viewAllEntries').replace('{count}', String(entries.length))}</p>
        ) : (
            <p className="text-muted-foreground">{t('noEntriesYet')}</p>
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
