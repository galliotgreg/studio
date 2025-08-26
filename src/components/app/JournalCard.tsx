
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
import { WordCloudCard } from "./WordCloudCard";

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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-muted-foreground">{t('viewAllEntries').replace('{count}', String(entries.length))}</p>
            </div>
            <div className="md:col-span-1 row-start-1 md:row-start-auto">
                <WordCloudCard entries={entries} />
            </div>
          </div>
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
