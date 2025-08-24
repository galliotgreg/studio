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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge as BadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgesCardProps {
  allBadges: BadgeType[];
  unlockedBadgeIds: string[];
}

export function BadgesCard({ allBadges, unlockedBadgeIds }: BadgesCardProps) {
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-primary" />
          <span>My Badges</span>
        </CardTitle>
        <CardDescription>
          Achievements you've unlocked on your gratitude journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-row flex-wrap gap-4">
            {allBadges.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              return (
                <Tooltip key={badge.id} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex flex-col items-center gap-2 transition-opacity",
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{badge.name}</p>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
