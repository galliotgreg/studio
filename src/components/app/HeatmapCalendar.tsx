
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/components/app/LanguageProvider";
import { cn } from "@/lib/utils";
import { GratitudeEntry } from "@/lib/types";
import { format, subDays, startOfWeek, addDays, isSameDay, getMonth } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface HeatmapCalendarProps {
  entries: GratitudeEntry[];
  onDayClick: (date: Date) => void;
  days?: number;
}

export function HeatmapCalendar({ entries, onDayClick, days = 98 }: HeatmapCalendarProps) {
  const { t, language } = useLanguage();
  const locale = language === 'fr' ? fr : enUS;

  const entryMap = React.useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
      map.set(dateStr, (map.get(dateStr) || 0) + 1);
    });
    return map;
  }, [entries]);

  const today = new Date();
  const weekStartsOn = locale.options?.weekStartsOn ?? 1;
  const startDate = startOfWeek(subDays(today, days - 1), { weekStartsOn });
  
  const calendarDays = React.useMemo(() => {
    return Array.from({ length: days }).map((_, i) => addDays(startDate, i));
  }, [startDate, days]);

  const monthLabels = React.useMemo(() => {
    const labels = new Map<number, { name: string; colStart: number }>();
    calendarDays.forEach((day, index) => {
        const month = getMonth(day);
        const col = Math.floor(index / 7) + 1;
        if (!labels.has(month)) {
            labels.set(month, { name: format(day, 'MMM', { locale }), colStart: col });
        }
    });
    return Array.from(labels.values());
  }, [calendarDays, locale]);
  
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 1) return "bg-primary/40";
    if (count <= 3) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <TooltipProvider>
      <Card className="transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
        <CardHeader>
          <CardTitle>{t('heatmapTitle')}</CardTitle>
          <CardDescription>{t('heatmapDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {calendarDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = entryMap.get(dateStr) || 0;
                const tooltipContent = count > 0
                  ? `${count} ${count > 1 ? t('entries') : t('entry')} - ${format(day, 'PPP', { locale })}`
                  : `${t('noEntry')} - ${format(day, 'PPP', { locale })}`;

                return (
                  <Tooltip key={day.toString()}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onDayClick(day)}
                        className={cn(
                          "w-5 h-5 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                          getIntensityClass(count),
                          isSameDay(day, new Date()) && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        )}
                        aria-label={tooltipContent}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltipContent}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
             <div className="absolute -top-5 left-0 right-0 flex justify-between px-1" style={{ gridColumn: '1 / -1' }}>
                {monthLabels.map(({ name, colStart }) => (
                    <div key={name} className="text-xs text-muted-foreground" style={{ gridColumnStart: colStart }}>
                        {name}
                    </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
