"use client";

import { Star } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="text-center relative">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full border border-primary/20">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h1 className="text-2xl md:text-4xl font-headline font-bold text-primary-foreground tracking-tight">
          Gratitude Challenge
        </h1>
        <Star className="w-5 h-5 text-primary fill-primary" />
      </div>
      <p className="mt-3 text-lg text-muted-foreground">
        A 30-day journey to a more thankful life.
      </p>
      <div className="absolute top-0 right-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
