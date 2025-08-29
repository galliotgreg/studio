
"use client";

import { AppIcon } from "./AppIcon";
import { useLanguage } from "./LanguageProvider";
import { GratitudeEntry } from "@/lib/types";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface ShareImagePreviewCardProps {
  entry: GratitudeEntry;
}

export function ShareImagePreviewCard({ entry }: ShareImagePreviewCardProps) {
    const { t, language } = useLanguage();
    const date = new Date(entry.date);

    return (
        <div className="aspect-[9/16] w-full bg-gradient-to-br from-primary/10 via-background to-background border rounded-lg p-6 flex flex-col shadow-2xl">
            <div className="flex-grow flex flex-col justify-center items-center text-center">
                <p className="text-sm text-muted-foreground italic mb-4">
                    &ldquo;{entry.prompt}&rdquo;
                </p>
                <p className="text-2xl font-serif font-medium text-foreground">
                    {entry.text}
                </p>
            </div>
            <div className="flex-shrink-0 text-center text-muted-foreground text-sm space-y-2">
                <p>{format(date, 'PPP', { locale: language === 'fr' ? fr : enUS })}</p>
                <div className="flex items-center justify-center gap-2">
                    <AppIcon className="w-5 h-5"/>
                    <p className="font-bold">{t('appTitle')}</p>
                </div>
            </div>
        </div>
    );
}

