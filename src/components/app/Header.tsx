
"use client";

import { Star, Settings, Share2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

interface HeaderProps {
    onReset: () => void;
    onShare: () => void;
}

export function Header({ onReset, onShare }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="text-center relative">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full border border-primary/20">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h1 className="text-2xl md:text-4xl font-headline font-bold text-foreground tracking-tight">
          {t('appTitle')}
        </h1>
        <Star className="w-5 h-5 text-primary fill-primary" />
      </div>
      <p className="mt-3 text-lg text-muted-foreground">
        {t('appDescription')}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <a href="https://www.greg-ggt.com/gratitude/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          {t('blogLinkText')}
        </a>
      </p>
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onShare}>
            <Share2 className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t('share')}</span>
        </Button>
        <LanguageSwitcher />
        <ThemeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReset} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                    {t('resetChallenge')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
