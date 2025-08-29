
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/components/app/LanguageProvider";
import { cn } from "@/lib/utils";

// This is a static mockup component to visualize the heatmap concept.
// It does not use real data but simulates what it would look like.

const MOCK_DATA: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 2, 2, 1, 0, 0, 1, 2,
  3, 3, 2, 1, 1, 2, 3, 4, 4, 3, 0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 1, 2, 3,
  4, 0, 1, 2, 1, 0, 1, 1, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
];

const colorClasses = [
  "bg-muted/30",         // 0 entries
  "bg-primary/20",       // 1 entry
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",          // 5+ entries
];

const monthNames = ["Mai", "Juin", "Juil"];

export function HeatmapMockup() {
  const { t } = useLanguage();

  return (
    <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        <CardTitle>Maquette du Calendrier Heatmap</CardTitle>
        <CardDescription>Visualisation de la régularité.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-muted-foreground mb-2 px-1">
          {monthNames.map(name => <span key={name}>{name}</span>)}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 gap-1">
          {MOCK_DATA.slice(0, 35).map((level, index) => (
            <div
              key={index}
              className={cn(
                "w-full h-5 rounded-sm",
                colorClasses[Math.min(level, colorClasses.length - 1)]
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
