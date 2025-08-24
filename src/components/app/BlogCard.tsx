"use client";

import { Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";

interface BlogCardProps {
  href: string;
}

export function BlogCard({ href }: BlogCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Newspaper className="text-primary"/>
            <span>{t('blogTitle')}</span>
        </CardTitle>
        <CardDescription>
          {t('blogDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="justify-end">
        <Button asChild variant="outline">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {t('readArticle')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
