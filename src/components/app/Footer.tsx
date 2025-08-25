
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
      <path d="M13.644 22.156c-1.288.366-2.757.565-4.29.565-5.235 0-9.48-4.244-9.48-9.48S4.119 3.76 9.354 3.76c2.53 0 4.814.99 6.51 2.615l-2.09 2.09c-1.23-1.16-2.9-1.87-4.73-1.87-3.415 0-6.185 2.77-6.185 6.185s2.77 6.185 6.185 6.185c2.09 0 3.89-.99 5.04-2.52l2.125 2.125c-1.74 1.94-4.22 3.125-7.075 3.125-6.32 0-11.44-5.12-11.44-11.44S5.68 0 12 0s12 5.68 12 12c0 3.395-1.48 6.44-3.86 8.58l-2.09-2.09c.99-1.23 1.57-2.835 1.57-4.525 0-3.415-2.77-6.185-6.185-6.185s-6.185 2.77-6.185 6.185c0 1.905.86 3.6 2.195 4.775l-2.09 2.09C3.164 18.015.874 15.22.874 12 .874 6.96 4.96 2.875 10.005 2.875c2.42 0 4.63.925 6.29 2.44l2.09-2.09C16.51 1.35 14.244.37 11.71.37 5.24.37.005 5.605.005 12.075c0 6.47 5.235 11.705 11.705 11.705 1.53 0 3.001-.295 4.38-1.12l-2.44-2.51z"/>
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
