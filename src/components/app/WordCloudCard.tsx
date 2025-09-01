
"use client";

import * as React from "react";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";
import type { GratitudeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface WordFrequency {
    text: string;
    value: number;
}

const commonWords = new Set(["le", "la", "les", "un", "une", "des", "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "suis", "es", "est", "sommes", "etes", "sont", "pour", "de", "du", "et", "a", "en", "que", "qui", "dans", "avec", "ce", "cet", "cette", "ces", "mon", "ma", "mes", "ete", "the", "a", "an", "i", "you", "he", "she", "it", "we", "they", "am", "is", "are", "for", "of", "and", "in", "with", "that", "this", "my"]);

// Helper function to remove accents and convert to lowercase for key generation
const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};


interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t } = useLanguage();
    const [wordCloudData, setWordCloudData] = React.useState<WordFrequency[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const generateWordCloud = () => {
            if (entries.length === 0) {
                setIsLoading(false);
                setWordCloudData([]);
                return;
            }

            setIsLoading(true);
            const allText = entries.map(e => e.text).join(" ");
            
            // Use a Map for robust frequency counting, storing the original form.
            const wordFrequencies = new Map<string, { original: string, count: number }>();
            
            // Regex to match words with Unicode letters, at least 3 chars long
            const allWords = allText.match(/\b(\p{L}{3,})\b/gu) || [];

            allWords.forEach(word => {
                const normalizedWord = normalizeText(word);
                
                if (!commonWords.has(normalizedWord)) {
                    if (wordFrequencies.has(normalizedWord)) {
                        // Increment count if the normalized form already exists
                        wordFrequencies.get(normalizedWord)!.count++;
                    } else {
                        // Otherwise, add the new word, storing its original form
                        wordFrequencies.set(normalizedWord, { original: word, count: 1 });
                    }
                }
            });
            
            const data = Array.from(wordFrequencies.values())
                .map(item => ({ text: item.original, value: item.count }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 30);
            
            setWordCloudData(data);
            setIsLoading(false);
        };

        generateWordCloud();
    }, [entries]);

    if (entries.length === 0) {
        return null;
    }

    const maxFrequency = Math.max(...wordCloudData.map(d => d.value), 1);

    const colors = [
        "text-primary",
        "text-secondary-foreground",
        "text-accent-foreground",
        "text-destructive",
        "text-foreground",
    ];

    return (
        <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Cloud className="text-primary" />
                    <span>{t("wordCloudTitle")}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center items-center min-h-[100px]">
                    {isLoading ? (
                       <div data-testid="loader" className="w-full space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                           <Skeleton className="h-4 w-5/6" />
                       </div>
                    ) : wordCloudData.length > 0 ? (
                        wordCloudData.map((word, index) => (
                            <motion.span
                                key={word.text + index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(colors[index % colors.length], "transition-all duration-300 hover:scale-110")}
                                style={{ 
                                    fontSize: `${0.75 + (word.value / maxFrequency) * 1.25}rem`,
                                    fontWeight: 400 + Math.round((word.value / maxFrequency) * 300),
                                 }}
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
