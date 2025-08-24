"use client";

import { Forward, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";

interface QuoteCardProps {
  quote: string;
  author: string;
  onNewQuote: () => void;
}

export function QuoteCard({ quote, author, onNewQuote }: QuoteCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquareQuote className="text-primary"/>
            <span>{t('quoteTitle')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <blockquote className="border-l-4 border-primary pl-4 italic">
          <p className="text-lg">"{quote}"</p>
        </blockquote>
        <p className="text-right mt-2 font-semibold text-primary">- {author}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={onNewQuote}>
          {t('newQuote')}
          <Forward className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
