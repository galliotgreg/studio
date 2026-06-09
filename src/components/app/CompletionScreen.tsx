"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Crown, Share2, BookOpen, LayoutDashboard } from "lucide-react";

import type { GratitudeEntry } from "@/lib/types";
import { BADGES } from "@/lib/data";
import { computeLongestStreak } from "@/lib/streak";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/app/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { NewsletterSignupCard } from "@/components/app/NewsletterSignupCard";
import { ShareJourneyCard } from "@/components/app/ShareJourneyCard";

const CHALLENGE_DURATION = 30;

interface CompletionScreenProps {
  entries: GratitudeEntry[];
  /** Mémorise l'abonnement (gate au prochain montage). */
  onNewsletterSubscribed: () => void;
  /** Affiche encore la carte newsletter ? (false si déjà abonné·e/fermée). */
  showNewsletter: boolean;
  /** Débloque le badge "partage" au premier partage réussi. */
  onShareBadgeUnlock: () => void;
  /** Échappatoire : revenir au tableau de bord classique. */
  onBackToDashboard: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function CompletionScreen({
  entries,
  onNewsletterSubscribed,
  showNewsletter,
  onShareBadgeUnlock,
  onBackToDashboard,
}: CompletionScreenProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const entriesCount = entries.length;
  const longestStreak = React.useMemo(
    () => computeLongestStreak(entries),
    [entries]
  );
  const finalBadge = BADGES.find((b) => b.id === "streak-30");

  const [shareOpen, setShareOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const journeyRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!journeyRef.current) return;
    setIsGenerating(true);
    try {
      const fontEmbedCss = `
        @font-face {
          font-family: 'Literata';
          src: url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap');
        }
      `;
      const dataUrl = await toPng(journeyRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        fontEmbedCSS: fontEmbedCss,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const fileName = "mon-parcours-gratitude-30-jours.png";
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: t("appTitle"),
          text: t("completionShareHeadline"),
          files: [file],
        });
        onShareBadgeUnlock();
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        onShareBadgeUnlock();
      }
      setShareOpen(false);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Failed to generate or share journey image", err);
        toast({
          title: t("exportErrorTitle"),
          description: t("exportErrorDescription"),
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8 py-6">
      {/* Hero : badge final mis en scène */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/40"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: 1, delay: 0.4 }}
        />
        <div className="relative p-6 rounded-full bg-primary/15">
          <Crown className="h-16 w-16 text-primary" />
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
          {t("completionHeroTitle")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("completionHeroSubtitle")}
        </p>
      </motion.div>

      {/* Récap chiffré des 30 jours */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-4 w-full"
      >
        <RecapTile value={entriesCount} label={t("completionRecapEntries")} />
        <RecapTile
          value={longestStreak}
          label={t("completionRecapLongestStreak")}
        />
        <RecapTile
          value={`${Math.min(entriesCount, CHALLENGE_DURATION)}/${CHALLENGE_DURATION}`}
          label={t("completionRecapDays")}
        />
      </motion.div>

      {/* Badge final nommé */}
      {finalBadge && (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2"
        >
          <Crown className="h-5 w-5 text-primary" />
          <span className="text-sm">
            <span className="text-muted-foreground">
              {t("completionBadgeUnlocked")}{" "}
            </span>
            <span className="font-bold text-primary">
              {t(finalBadge.nameKey)}
            </span>
          </span>
        </motion.div>
      )}

      {/* CTA newsletter (attribution J30) + amorce app */}
      {showNewsletter && (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.65 }}
          className="w-full"
        >
          <NewsletterSignupCard
            variant="completion"
            source="defi-j30"
            onSubscribed={onNewsletterSubscribed}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {t("completionAppTeaser")}
          </p>
        </motion.div>
      )}

      {/* Partage du parcours + échappatoires */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        <Button onClick={() => setShareOpen(true)} className="gap-2">
          <Share2 className="h-4 w-4" />
          {t("completionShareCta")}
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Button asChild variant="link" className="text-muted-foreground gap-1 h-auto p-0">
            <Link href="/journal">
              <BookOpen className="h-4 w-4" />
              {t("completionViewJournal")}
            </Link>
          </Button>
          <Button
            variant="link"
            onClick={onBackToDashboard}
            className="text-muted-foreground gap-1 h-auto p-0"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("completionBackToDashboard")}
          </Button>
        </div>
      </motion.div>

      {/* Dialog d'aperçu + génération image */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("completionShareDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("completionShareDialogDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="max-w-[240px] mx-auto w-full">
            <ShareJourneyCard
              ref={journeyRef}
              entriesCount={entriesCount}
              longestStreak={longestStreak}
            />
          </div>
          <Button onClick={handleDownloadImage} disabled={isGenerating} className="w-full">
            {isGenerating ? t("newsletterSubmitting") : t("completionShareDownload")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecapTile({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) {
  return (
    <Card className="bg-card">
      <CardContent className="p-4 flex flex-col items-center gap-1">
        <span className="text-2xl md:text-3xl font-bold text-primary">
          {value}
        </span>
        <span className="text-xs text-muted-foreground leading-tight">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}
