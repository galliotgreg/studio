
"use client";

import { Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const BlueskyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10c-3.5 0-7 2.5-7 7s3.5 7 7 7c3.5 0 7-2.5 7-7c0-4-3.5-7-7-7z" />
      <path d="M12 10c-3.5 0-7-2.5-7-7s3.5-7 7-7c3.5 0 7 2.5 7 7c0 4-3.5 7-7-7z" />
      <path d="M19 10c-3.5 0-7 2.5-7 7s3.5 7 7 7c3.5 0 7-2.5 7-7c0-4-3.5-7-7-7z" />
      <path d="M5 10c-3.5 0-7 2.5-7 7s3.5 7 7 7c3.5 0 7-2.5 7-7c0-4-3.5-7-7-7z" />
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
              <link.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
