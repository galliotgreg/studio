
"use client";

import { Settings, Share2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { AppIcon } from "./AppIcon";

interface HeaderProps {
    onReset: () => void;
    onShare: () => void;
}

export function Header({ onReset, onShare }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col md:flex-row items-center justify-between text-center p-4 gap-4">
        <div className="w-full md:w-1/3"></div>

        <div className="flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full border border-primary/20">
                <AppIcon className="w-8 h-8 text-primary" />
                <h1 className="text-2xl md:text-4xl font-headline font-bold text-foreground tracking-tight">
                {t('appTitle')}
                </h1>
                <AppIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="mt-3 text-lg text-muted-foreground">
                {t('appDescription')}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                <a href="https://www.greg-ggt.com/gratitude/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                {t('blogLinkText')}
                </a>
            </p>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-1/3">
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
                    <DropdownMenuLabel>{t('settings')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onReset} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                        {t('resetChallenge')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}
