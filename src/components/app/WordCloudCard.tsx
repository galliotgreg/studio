
"use client";

import * as React from "react";
import { Cloud } from "lucide-react";
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

// Basic stop words lists
const stopWords: { [key: string]: string[] } = {
    en: [
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
        "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
        "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
        "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
        "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
        "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
        "im", "ive"
    ],
    fr: [
        "je", "me", "moi", "mon", "ma", "mes", "tu", "te", "toi", "ton", "ta", "tes", "il", "elle", "lui", "soi", "son",
        "sa", "ses", "nous", "notre", "nos", "vous", "votre", "vos", "ils", "elles", "leur", "leurs", "ce", "cet",
        "cette", "ces", "le", "la", "les", "un", "une", "des", "du", "de", "d", "au", "aux", "à", "et", "ou", "mais",
        "si", "car", "parce", "que", "qui", "quoi", "dont", "où", "quand", "comment", "pourquoi", "pour", "avec", "sans",
        "dans", "sur", "sous", "vers", "par", "depuis", "pendant", "avant", "après", "suis", "es", "est", "sommes",
        "êtes", "sont", "étais", "était", "étions", "étiez", "étaient", "ai", "as", "a", "avons", "avez", "ont",
        "avais", "avait", "avions", "aviez", "avaient", "fais", "fait", "faisons", "faites", "font", "jai", "nest", "pas", "plus"
    ]
};

interface WordCloudCardProps {
    entries: GratitudeEntry[];
}

interface WordFrequency {
    text: string;
    value: number;
}

export function WordCloudCard({ entries }: WordCloudCardProps) {
    const { t, language } = useLanguage();
    
    const wordCloudData = React.useMemo(() => {
        const allText = entries.map(e => e.text).join(" ");
        const words = allText
            .toLowerCase()
            .replace(/[.,!?;:()"'-]/g, " ")
            .split(/\s+/);
        
        const currentStopWords = stopWords[language] || [];

        const wordFrequencies: { [key: string]: number } = {};
        words.forEach(word => {
            if (word && !currentStopWords.includes(word) && word.length > 2) {
                wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
            }
        });

        return Object.entries(wordFrequencies)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 30); // Take top 30 words
    }, [entries, language]);

    if (wordCloudData.length === 0) {
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
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center">
                    {wordCloudData.map((word, index) => (
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
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
