
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
import { extractKeywords } from "@/ai/flows/extract-keywords-flow";
import { Skeleton } from "../ui/skeleton";

interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

interface WordFrequency {
    text: string;
    value: number;
}

const commonWords = new Set(["le", "la", "les", "un", "une", "des", "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "suis", "es", "est", "sommes", "etes", "sont", "pour", "de", "du", "et", "à", "en", "que", "qui", "dans", "avec", "ce", "cet", "cette", "ces", "mon", "ma", "mes", "the", "a", "an", "i", "you", "he", "she", "it", "we", "they", "am", "is", "are", "for", "of", "and", "in", "with", "that", "this", "my"]);


export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t } = useLanguage();
    const [wordCloudData, setWordCloudData] = React.useState<WordFrequency[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const generateWordCloud = async () => {
            if (entries.length === 0) {
                setIsLoading(false);
                setWordCloudData([]);
                return;
            }

            setIsLoading(true);
            const allText = entries.map(e => e.text).join(" ");
            
            // --- Step 1: Immediate local processing for quick feedback ---
            const localWordFrequencies: { [key: string]: number } = {};
            const allWords = allText.toLowerCase().match(/\b(\w{3,})\b/g) || [];

            allWords.forEach(word => {
                if (!commonWords.has(word)) {
                    localWordFrequencies[word] = (localWordFrequencies[word] || 0) + 1;
                }
            });
            
            const initialData = Object.entries(localWordFrequencies)
                .map(([text, value]) => ({ text, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 30);
            
            setWordCloudData(initialData);
            // Don't set loading to false here anymore

            // --- Step 2: AI-powered keyword extraction in the background ---
            try {
                const result = await extractKeywords({ text: allText });
                if (result.keywords.length > 0) {
                    const aiKeywordSet = new Set(result.keywords.map(k => k.toLowerCase()));
                    
                    const refinedFrequencies: { [key: string]: number } = {};
                     allText.toLowerCase().match(/\b(\w+)\b/g)?.forEach(word => {
                        if (aiKeywordSet.has(word)) {
                            refinedFrequencies[word] = (refinedFrequencies[word] || 0) + 1;
                        }
                    });

                    const refinedData = Object.entries(refinedFrequencies)
                        .map(([text, value]) => ({ text, value }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 30);
                    
                    if (refinedData.length > 0) {
                        setWordCloudData(refinedData);
                    }
                }
            } catch (error) {
                console.error("Failed to generate AI word cloud, using local fallback:", error);
            } finally {
                setIsLoading(false); // Set loading to false only after everything is done
            }
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
                                key={word.text}
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
