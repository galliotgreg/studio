
"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Share2 } from "lucide-react";

import type { GratitudeEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";
import { Button } from "../ui/button";

interface JournalEntryCardProps {
  entry: GratitudeEntry;
  onShare: (entry: GratitudeEntry) => void;
}

export function JournalEntryCard({ entry, onShare }: JournalEntryCardProps) {
  const { language, t } = useLanguage();
  const date = new Date(entry.date);

  return (
    <Card className="bg-secondary/30 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{`${t('dailyGratitude').split(' ')[0]} ${entry.day} - ${format(date, 'PPP', { locale: language === 'fr' ? fr : enUS })}`}</CardTitle>
        <CardDescription className="italic pt-1">
          {entry.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{entry.text}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => onShare(entry)}>
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">{t('share')}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
