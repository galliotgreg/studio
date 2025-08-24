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

interface ProgressCardProps {
  currentDay: number;
  totalDays: number;
}

export function ProgressCard({ currentDay, totalDays }: ProgressCardProps) {
  const progressPercentage = (Math.min(currentDay, totalDays) / totalDays) * 100;
  
  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarDays className="text-primary"/>
            <span>Challenge Progress</span>
        </CardTitle>
        <CardDescription>
          You are on day {currentDay} of your {totalDays}-day journey.
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
