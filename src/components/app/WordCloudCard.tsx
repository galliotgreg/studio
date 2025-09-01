
"use client";

import * as React from "react";
import { Cloud } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";
import type { GratitudeEntry } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

// Étape 2: Création de la fonction de normalisation
const normalizeWord = (word: string) => {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

interface WordFrequency {
    original: string;
    count: number;
}

export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t } = useLanguage();
    // L'état stockera maintenant le résultat de l'étape 2
    const [wordFrequencies, setWordFrequencies] = React.useState<WordFrequency[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);

        if (entries.length === 0) {
            setWordFrequencies([]);
            setIsLoading(false);
            return;
        }

        // Étape 1 : Agréger et extraire les mots (inchangé)
        const allText = entries.map(e => e.text).join(" ");
        const allWords = allText.match(/\p{L}{3,}/gu) || [];

        // Étape 2 : Normalisation et Comptage Intelligent
        const wordMap = new Map<string, { original: string, count: number }>();

        allWords.forEach(word => {
            const normalizedKey = normalizeWord(word);
            
            const existingEntry = wordMap.get(normalizedKey);

            if (existingEntry) {
                // Si le mot existe déjà, on incrémente son compteur
                existingEntry.count++;
            } else {
                // Sinon, on l'ajoute en gardant sa forme originale
                wordMap.set(normalizedKey, { original: word, count: 1 });
            }
        });
        
        // On transforme la Map en tableau pour la stocker dans l'état
        const frequencies = Array.from(wordMap.values());
        setWordFrequencies(frequencies);

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
                    Vérification - Étape 2 : Comptage des mots
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
                    ) : wordFrequencies.length > 0 ? (
                        // Affichage temporaire pour vérification
                        <p className="text-sm text-muted-foreground text-left">
                           {JSON.stringify(wordFrequencies, null, 2)}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm">{t('noEntriesYetCloud')}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
