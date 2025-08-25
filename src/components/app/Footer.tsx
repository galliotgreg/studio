
"use client";

import { Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const BlueskyIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="currentColor"
    >
      <title>Bluesky</title>
      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm5.22 5.48a.47.47 0 0 0-.61.08L12 11.69l-4.61-6.13a.47.47 0 0 0-.74-.01.47.47 0 0 0 .13.66l4.22 5.61-4.22 5.63a.47.47 0 0 0 .61.74l4.61-6.13 4.61 6.13a.47.47 0 0 0 .74.01.47.47 0 0 0-.13-.66l-4.22-5.61 4.22-5.63a.47.47 0 0 0-.13-.74z" />
    </svg>
);

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Bluesky", icon: BlueskyIcon, href: "#" },
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
              <link.icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
