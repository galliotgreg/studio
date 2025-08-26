
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
  currentDay: number;
  totalDays: number;
  isCompleted: boolean;
}

export function ProgressCard({ currentDay, totalDays, isCompleted }: ProgressCardProps) {
  const { t } = useLanguage();
  const completedDays = isCompleted ? currentDay - 1 : Math.max(0, currentDay -1);
  const progressPercentage = (completedDays / totalDays) * 100;
  
  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-primary"/>
            <span>{t('challengeProgress')}</span>
        </CardTitle>
        <CardDescription>
          {t('progressDescription').replace('{day}', String(completedDays)).replace('{totalDays}', String(totalDays))}
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
