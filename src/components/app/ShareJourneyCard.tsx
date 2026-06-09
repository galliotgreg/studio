"use client";

import * as React from "react";
import { Crown } from "lucide-react";

import { AppIcon } from "./AppIcon";
import { useLanguage } from "./LanguageProvider";

interface ShareJourneyCardProps {
  entriesCount: number;
  longestStreak: number;
}

/**
 * Visuel 9:16 partageable du parcours accompli (fin du défi 30 jours).
 * Levier d'acquisition organique : chaque image partagée = mini-pub.
 * Rendu hors-écran puis capturé en PNG par html-to-image (cf. CompletionScreen).
 */
export const ShareJourneyCard = React.forwardRef<HTMLDivElement, ShareJourneyCardProps>(
  ({ entriesCount, longestStreak }, ref) => {
    const { t } = useLanguage();

    return (
      <div
        ref={ref}
        className="aspect-[9/16] w-full bg-gradient-to-br from-primary/15 via-background to-background border rounded-lg p-6 flex flex-col items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-2 text-muted-foreground pt-2">
          <AppIcon className="w-5 h-5" />
          <p className="font-bold text-sm">{t("appTitle")}</p>
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-5 rounded-full bg-primary/15">
            <Crown className="h-12 w-12 text-primary" />
          </div>
          <p className="text-3xl font-serif font-medium text-foreground leading-tight">
            {t("completionShareHeadline")}
          </p>
        </div>

        <div className="w-full flex justify-center gap-8 text-center pb-2">
          <div>
            <p className="text-3xl font-bold text-primary">{entriesCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {entriesCount > 1 ? t("entries") : t("entry")}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{longestStreak}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {t("completionLongestStreakLabel")}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
ShareJourneyCard.displayName = "ShareJourneyCard";
