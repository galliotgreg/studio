"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, X, PartyPopper } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/app/LanguageProvider";
import { subscribeToNewsletter, isValidEmail } from "@/lib/newsletter";

type Variant = "inline" | "completion";

interface NewsletterSignupCardProps {
  variant?: Variant;
  /** Appelé quand l'abonnement réussit (pour mémoriser et ne plus afficher). */
  onSubscribed?: () => void;
  /** Si fourni, affiche un bouton de fermeture (déclencheur non bloquant). */
  onDismiss?: () => void;
  /**
   * Label d'attribution supplémentaire (ex. "defi-j30") posé en plus de "défi".
   * Permet de distinguer la source dans Ghost Admin (pic de complétion vs
   * mi-parcours). Sans effet sur l'UI.
   */
  source?: string;
}

export function NewsletterSignupCard({
  variant = "inline",
  onSubscribed,
  onDismiss,
  source,
}: NewsletterSignupCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "done">("idle");

  const isCompletion = variant === "completion";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (!isValidEmail(email)) {
      toast({
        title: t("newsletterErrorTitle"),
        description: t("newsletterInvalidEmail"),
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");
    const result = await subscribeToNewsletter(
      email,
      source ? ["défi", source] : undefined
    );

    if (result.ok) {
      setStatus("done");
      toast({
        title: t("newsletterSuccessTitle"),
        description: t("newsletterSuccessDescription"),
      });
      onSubscribed?.();
    } else {
      setStatus("idle");
      toast({
        title: t("newsletterErrorTitle"),
        description: t("newsletterErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative border-primary/40 bg-primary/5 transform transition-transform duration-300 hover:shadow-xl">
        {onDismiss && status !== "done" && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t("newsletterDismiss")}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            {isCompletion ? (
              <PartyPopper className="h-5 w-5" />
            ) : (
              <Mail className="h-5 w-5" />
            )}
            <span>
              {isCompletion
                ? t("newsletterCompletionTitle")
                : t("newsletterTitle")}
            </span>
          </CardTitle>
          <CardDescription>
            {isCompletion
              ? t("newsletterCompletionDescription")
              : t("newsletterDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "done" ? (
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCircle className="h-5 w-5" />
              <span>{t("newsletterCheckInbox")}</span>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletterEmailPlaceholder")}
                aria-label={t("newsletterEmailPlaceholder")}
                className="flex-grow"
                disabled={status === "loading"}
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading"
                  ? t("newsletterSubmitting")
                  : t("newsletterCta")}
              </Button>
            </form>
          )}
          {status !== "done" && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("newsletterConsent")}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
