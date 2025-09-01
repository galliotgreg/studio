
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
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

// Stop words to filter out common words from the cloud
const STOP_WORDS_FR = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'et', 'à', 'un', 'une', 'pour', 'dans', 'par', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'sont', 'est', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'sommes', 'etes', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs', 'ce', 'cet', 'cette', 'ces', 'que', 'qui', 'quoi', 'plus', 'avec', 'comme', 'pas', 'sur', 'se', 'au', 'aux', 'ne', 'en']);
const STOP_WORDS_EN = new Set(['the', 'a', 'an', 'and', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'are', 'is', 'am', 'was', 'were', 'for', 'in', 'on', 'of', 'to', 'by', 'with', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'that', 'this', 'these', 'those', 'not', 'but', 'at']);


const normalizeWord = (word: string): string => {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

interface WordFrequency {
    text: string;
    value: number;
}

// Color palette for the word cloud
const colorPalette = [
    "text-primary",
    "text-foreground",
    "text-foreground/80",
    "text-muted-foreground",
    "text-foreground/60"
];


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

        // Step 1: Aggregate and extract words
        const allText = entries.map(e => e.text).join(" ");
        const allWords = allText.match(/\p{L}{3,}/gu) || [];

        // Step 2: Intelligent normalization and counting
        const wordFrequencies = new Map<string, { original: string, count: number }>();
        allWords.forEach(word => {
            const normalizedWord = normalizeWord(word);
            const existing = wordFrequencies.get(normalizedWord);

            if (existing) {
                existing.count++;
            } else {
                wordFrequencies.set(normalizedWord, { original: word, count: 1 });
            }
        });
        
        // Step 3: Filtering and Finalization
        const stopWords = language === 'fr' ? STOP_WORDS_FR : STOP_WORDS_EN;
        const data = Array.from(wordFrequencies.values())
            .map(item => ({ text: item.original, value: item.count }))
            .filter(item => !stopWords.has(normalizeWord(item.text)))
            .sort((a, b) => b.value - a.value)
            .slice(0, 30);


        setWordData(data);
        setIsLoading(false);
    }, [entries, language]);

    if (entries.length === 0) {
        return null;
    }

    const getWordStyle = (value: number, min: number, max: number): React.CSSProperties => {
        if (max === min) return { fontSize: '1rem', fontWeight: 400 };
        
        const sizeRange = 2.5; // From 1rem to 3.5rem
        const weightRange = 500; // From 400 to 900
        const normalizedValue = (value - min) / (max - min);

        const fontSize = 1 + normalizedValue * sizeRange;
        const fontWeight = 400 + normalizedValue * weightRange;
        
        return { fontSize: `${fontSize}rem`, fontWeight };
    };

    const minFreq = wordData.length > 0 ? Math.min(...wordData.map(d => d.value)) : 1;
    const maxFreq = wordData.length > 0 ? Math.max(...wordData.map(d => d.value)) : 1;


    return (
        <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Cloud className="text-primary" />
                    <span>{t("wordCloudTitle")}</span>
                </CardTitle>
                 <CardDescription>
                    {t('wordCloudDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center items-center min-h-[150px]">
                    {isLoading ? (
                       <div data-testid="loader" className="w-full space-y-2 p-4">
                           <Skeleton className="h-6 w-3/4" />
                           <Skeleton className="h-5 w-1/2" />
                           <Skeleton className="h-5 w-5/6" />
                           <Skeleton className="h-4 w-2/3" />
                       </div>
                    ) : wordData.length > 0 ? (
                        wordData.map((word, index) => (
                           <motion.span
                                key={`${word.text}-${index}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                style={getWordStyle(word.value, minFreq, maxFreq)}
                                className={cn("leading-none", colorPalette[index % colorPalette.length])}
                            >
                                {word.text}
                            </motion.span>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">{t('noEntriesYetCloud')}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
