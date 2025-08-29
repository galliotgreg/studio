
"use client";

import * as React from "react";
import { Award, Gift } from "lucide-react";
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
import { Separator } from "../ui/separator";

interface BadgesCardProps {
  allBadges: BadgeType[];
  unlockedBadgeIds: string[];
}

const BadgeDisplay = ({ badge, unlockedBadgeIds }: { badge: BadgeType, unlockedBadgeIds: string[] }) => {
  const { t } = useLanguage();
  const prevUnlockedBadgeIdsRef = React.useRef<string[]>(unlockedBadgeIds);
  const [isNew, setIsNew] = React.useState(false);

  React.useEffect(() => {
    const wasUnlocked = prevUnlockedBadgeIdsRef.current.includes(badge.id);
    const isNowUnlocked = unlockedBadgeIds.includes(badge.id);
    if (isNowUnlocked && !wasUnlocked) {
      setIsNew(true);
    }
    prevUnlockedBadgeIdsRef.current = unlockedBadgeIds;
  }, [unlockedBadgeIds, badge.id]);

  const isUnlocked = unlockedBadgeIds.includes(badge.id);

  return (
    <Popover key={badge.id}>
      <PopoverTrigger asChild>
        <motion.div
          className={cn(
            "flex flex-col items-center gap-2 transition-opacity cursor-pointer",
            !isUnlocked && "opacity-30 grayscale"
          )}
          animate={isNew ? { scale: [1, 1.2, 1], transition: { duration: 0.8, ease: "easeInOut" } } : {}}
        >
          <div className="p-3 rounded-full bg-secondary relative">
            {isNew && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/50"
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  repeat: 1,
                  delay: 0.5,
                }}
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
};


export const BadgesCard = React.forwardRef<HTMLDivElement, BadgesCardProps>(
  ({ allBadges, unlockedBadgeIds }, ref) => {
    const { t } = useLanguage();

    const progressionBadges = allBadges.filter(b => b.category === 'progression');
    const treasureBadges = allBadges.filter(b => b.category === 'treasure');
    const unlockedTreasures = treasureBadges.filter(b => unlockedBadgeIds.includes(b.id));

    return (
      <Card ref={ref} className="h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
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
            {progressionBadges.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} unlockedBadgeIds={unlockedBadgeIds} />
            ))}
          </div>

          {unlockedTreasures.length > 0 && (
             <>
                <Separator className="my-6" />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Gift className="text-primary" />
                        {t('treasureDiscovered')}
                    </h3>
                    <div className="flex flex-row flex-wrap gap-4">
                        {unlockedTreasures.map((badge) => (
                             <BadgeDisplay key={badge.id} badge={badge} unlockedBadgeIds={unlockedBadgeIds} />
                        ))}
                    </div>
                </div>
             </>
          )}
        </CardContent>
      </Card>
    );
  }
);
BadgesCard.displayName = "BadgesCard";
