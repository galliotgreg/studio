
"use client";

import { Instagram, Linkedin, MessageSquareText } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Bluesky", icon: MessageSquareText, href: "#" },
  ];

  return (
    <footer className="w-full py-6 mt-8 border-t border-border/50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground text-sm mb-4 md:mb-0">
          {t('footerText')}
        </p>
        <div className="flex items-center space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={link.name}
            >
              <link.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
