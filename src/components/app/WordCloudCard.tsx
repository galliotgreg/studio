
"use client";

import * as React from "react";
import { Cloud, Loader } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";
import type { GratitudeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { extractKeywords } from "@/ai/flows/extract-keywords-flow";

interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

interface WordFrequency {
    text: string;
    value: number;
}

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
            
            try {
                const result = await extractKeywords({ text: allText });
                
                const wordFrequencies: { [key: string]: number } = {};
                // The AI now returns unique keywords, but we might still want to aggregate
                // if the same keyword appears across different processing chunks in a larger implementation.
                // For now, we'll just count them as they come.
                result.keywords.forEach(word => {
                    const lowerWord = word.toLowerCase();
                    wordFrequencies[lowerWord] = (wordFrequencies[lowerWord] || 0) + 1;
                });
                
                const formattedData = Object.entries(wordFrequencies)
                    .map(([text, value]) => ({ text, value }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 30);

                setWordCloudData(formattedData);
            } catch (error) {
                console.error("Failed to generate word cloud:", error);
                setWordCloudData([]);
            } finally {
                setIsLoading(false);
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
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="text-primary" />
                    <span>{t("wordCloudTitle")}</span>
                </CardTitle>
                <CardDescription>
                    {t("wordCloudDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center min-h-[100px]">
                    {isLoading ? (
                        <Loader className="animate-spin" data-testid="loader" />
                    ) : wordCloudData.length > 0 ? (
                        wordCloudData.map((word, index) => (
                            <motion.span
                                key={word.text}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(colors[index % colors.length], "transition-all duration-300 hover:scale-110")}
                                style={{ 
                                    fontSize: `${0.75 + (word.value / maxFrequency) * 1.5}rem`,
                                    fontWeight: 400 + Math.round((word.value / maxFrequency) * 300),
                                 }}
                            >
                                {word.text}
                            </motion.span>
                        ))
                    ) : (
                        <p className="text-muted-foreground">{t('noEntriesYet')}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
