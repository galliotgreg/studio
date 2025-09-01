
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

// Stop words for both languages
const STOP_WORDS_FR = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'et', 'à', 'un', 'une', 'pour', 'dans', 'par', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'sont', 'est', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'sommes', 'etes', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs', 'ce', 'cet', 'cette', 'ces', 'que', 'qui', 'quoi', 'plus', 'avec', 'comme', 'pas', 'sur', 'se', 'au', 'aux', 'ne', 'en']);
const STOP_WORDS_EN = new Set(['the', 'a', 'an', 'and', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'are', 'is', 'am', 'was', 'were', 'for', 'in', 'on', 'of', 'to', 'by', 'with', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'that', 'this', 'these', 'those', 'not', 'but', 'at']);


// Simple normalization function (lowercase, remove accents)
const normalizeWord = (word: string) => {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

interface WordFrequency {
    text: string;
    value: number;
}

export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t, language } = useLanguage();
    const [wordData, setWordData] = React.useState<WordFrequency[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);

        if (entries.length === 0) {
            setWordData([]);
            setIsLoading(false);
            return;
        }

        // Étape 1 : Agréger et extraire les mots
        const allText = entries.map(e => e.text).join(" ");
        const allWords = allText.match(/\p{L}{3,}/gu) || [];

        // Étape 2 : Normalisation et Comptage Intelligent
        const wordMap = new Map<string, { original: string, count: number }>();

        allWords.forEach(word => {
            const normalizedKey = normalizeWord(word);
            
            const existingEntry = wordMap.get(normalizedKey);

            if (existingEntry) {
                existingEntry.count++;
            } else {
                wordMap.set(normalizedKey, { original: word, count: 1 });
            }
        });
        
        // Étape 3 : Filtrage et Finalisation
        const stopWords = language === 'fr' ? STOP_WORDS_FR : STOP_WORDS_EN;
        const filteredAndSortedData = Array.from(wordMap.entries())
            .filter(([normalizedKey, _]) => !stopWords.has(normalizedKey))
            .map(([_, data]) => ({
                text: data.original,
                value: data.count,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 30);


        setWordData(filteredAndSortedData);
        setIsLoading(false);
    }, [entries, language]);

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
                    Vérification - Étape 3 : Filtrage et Tri
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
                    ) : wordData.length > 0 ? (
                         // Affichage temporaire pour vérification
                        <p className="text-sm text-muted-foreground text-left w-full">
                           {JSON.stringify(wordData, null, 2)}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-sm">{t('noEntriesYetCloud')}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
