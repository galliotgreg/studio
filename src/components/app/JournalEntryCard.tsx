
"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import type { GratitudeEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";

interface JournalEntryCardProps {
  entry: GratitudeEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const { language } = useLanguage();
  const date = new Date(entry.date);

  return (
    <Card className="bg-secondary/30">
      <CardHeader>
        <CardTitle className="text-lg">{`Day ${entry.day} - ${format(date, 'PPP', { locale: language === 'fr' ? fr : undefined })}`}</CardTitle>
        <CardDescription className="italic pt-1">
          {entry.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{entry.text}</p>
      </CardContent>
    </Card>
  );
}

