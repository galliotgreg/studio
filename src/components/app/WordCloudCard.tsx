
"use client";

import * as React from "react";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";
import type { GratitudeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t } = useLanguage();
    const [extractedWords, setExtractedWords] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Étape 1 : Préparation et Nettoyage du Texte
    React.useEffect(() => {
        setIsLoading(true);

        if (entries.length === 0) {
            setExtractedWords([]);
            setIsLoading(false);
            return;
        }

        // 1. Agréger tout le texte
        const allText = entries.map(e => e.text).join(" ");

        // 2. Extraire les "mots" (groupes de 3 lettres ou plus, Unicode)
        const words = allText.match(/\p{L}{3,}/gu) || [];
        
        setExtractedWords(words);
        setIsLoading(false);
    }, [entries]);

    if (entries.length === 0) {
        return null;
    }

    return (
        <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Cloud className="text-primary" />
                    <span>{t("wordCloudTitle")}</span>
                </CardTitle>
                <CardDescription>
                    Vérification - Étape 1 : Liste des mots extraits
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center items-center min-h-[100px]">
                    {isLoading ? (
                       <div data-testid="loader" className="w-full space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                           <Skeleton className="h-4 w-5/6" />
                       </div>
                    ) : extractedWords.length > 0 ? (
                        // Affichage temporaire pour vérification
                        <p className="text-sm text-muted-foreground text-left">
                            {extractedWords.join(', ')}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm">{t('noEntriesYetCloud')}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
