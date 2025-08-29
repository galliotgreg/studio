
"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge as BadgeIcon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Theme } from "@/lib/themes";
import { BADGES } from "@/lib/data";

interface ThemeInfoDialogProps {
  theme: Theme | null;
  onOpenChange: (open: boolean) => void;
}

export function ThemeInfoDialog({ theme, onOpenChange }: ThemeInfoDialogProps) {
  const { t } = useLanguage();

  if (!theme || !theme.unlockBadgeId) {
    return null;
  }

  const unlockingBadge = BADGES.find(b => b.id === theme.unlockBadgeId);

  return (
    <AlertDialog open={!!theme} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {t('theme.locked')} : {t(theme.nameKey)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('theme.unlockCondition')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center justify-center p-4 my-4 bg-secondary rounded-lg">
          {unlockingBadge && (
            <>
                <unlockingBadge.icon className="h-12 w-12 text-primary mb-3" />
                <p className="font-bold text-lg">{t(unlockingBadge.nameKey)}</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                    {t(unlockingBadge.descriptionKey)}
                </p>
            </>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('close')}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
