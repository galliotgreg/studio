
"use client";

import * as React from "react";
import { Award } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/components/app/LanguageProvider";
import { Badge as BadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgesCardProps {
  allBadges: BadgeType[];
  unlockedBadgeIds: string[];
}

export function BadgesCard({ allBadges, unlockedBadgeIds }: BadgesCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-primary" />
          <span>{t("myBadges")}</span>
        </CardTitle>
        <CardDescription>
          {t("badgesDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <Popover key={badge.id}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "flex flex-col items-center gap-2 transition-opacity cursor-pointer",
                      !isUnlocked && "opacity-30 grayscale"
                    )}
                  >
                    <div className="p-3 rounded-full bg-secondary">
                      <badge.icon
                        className={cn(
                          "h-8 w-8",
                          isUnlocked ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <div className="p-2">
                    <p className="font-bold">{t(badge.nameKey)}</p>
                    <p>{t(badge.descriptionKey)}</p>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
