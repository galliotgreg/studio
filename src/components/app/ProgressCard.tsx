
"use client";

import { CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "./LanguageProvider";

interface ProgressCardProps {
  completedDays: number;
  totalDays: number;
}

export function ProgressCard({ completedDays, totalDays }: ProgressCardProps) {
  const { t } = useLanguage();
  const progressPercentage = (completedDays / totalDays) * 100;
  
  const descriptionKey = completedDays === 1 ? 'progressDescriptionSingular' : 'progressDescriptionPlural';
  const description = t(descriptionKey)
    .replace('{day}', String(completedDays))
    .replace('{totalDays}', String(totalDays));

  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-primary"/>
            <span>{t('challengeProgress')}</span>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="font-bold">{Math.floor(progressPercentage)}%</span>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
