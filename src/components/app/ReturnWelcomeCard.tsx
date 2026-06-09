"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/app/LanguageProvider";

interface ReturnWelcomeCardProps {
  /** Nombre de jours écoulés depuis la dernière entrée. */
  days: number;
  /** Jour de défi à reprendre. */
  day: number;
  /** Action « Reprendre » (ex. focus/scroll vers la carte de saisie). */
  onResume?: () => void;
  /** Fermeture pour la session en cours. */
  onDismiss?: () => void;
}

/**
 * Carte de relance affichée au retour après une absence, pendant le défi.
 * Ton accueillant, zéro culpabilisation : on n'agite pas la série cassée,
 * on invite simplement à reprendre. Aucune dépendance externe (lit l'état local).
 */
export function ReturnWelcomeCard({ days, day, onResume, onDismiss }: ReturnWelcomeCardProps) {
  const { t } = useLanguage();

  const description = t("returnWelcomeDescription")
    .replace("{days}", String(days))
    .replace("{day}", String(day));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative border-primary/40 bg-primary/5">
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t("returnWelcomeDismiss")}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <HeartHandshake className="h-5 w-5" />
            <span>{t("returnWelcomeTitle")}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onResume}>{t("returnWelcomeCta")}</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
