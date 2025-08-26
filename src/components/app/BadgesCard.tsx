
"use client";

import * as React from "react";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

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
  const prevUnlockedBadgeIdsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    prevUnlockedBadgeIdsRef.current = unlockedBadgeIds;
  }, [unlockedBadgeIds]);

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
            const isNew = isUnlocked && !prevUnlockedBadgeIdsRef.current.includes(badge.id);
            
            return (
              <Popover key={badge.id}>
                <PopoverTrigger asChild>
                  <motion.div
                    className={cn(
                      "flex flex-col items-center gap-2 transition-opacity cursor-pointer",
                      !isUnlocked && "opacity-30 grayscale"
                    )}
                    initial={{ scale: 1 }}
                    animate={isNew ? { scale: [1, 1.2, 1], transition: { duration: 0.5, ease: "easeInOut" } } : {}}
                  >
                    <div className="p-3 rounded-full bg-secondary relative">
                       {isNew && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/50"
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0, transition: { duration: 1, ease: "easeOut" } }}
                        />
                      )}
                      <badge.icon
                        className={cn(
                          "h-8 w-8 relative z-10",
                          isUnlocked ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                  </motion.div>
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
