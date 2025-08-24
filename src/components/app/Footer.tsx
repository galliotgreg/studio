
"use client";

import { Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const BlueskyIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <title>Bluesky</title>
    <path
      d="M12 1.25a10.75 10.75 0 1 0 10.75 10.75A10.762 10.762 0 0 0 12 1.25m0 20A9.25 9.25 0 1 1 21.25 12 9.26 9.26 0 0 1 12 21.25m-3.415-9.45a3.313 3.313 0 0 1 .49-1.921 3.253 3.253 0 0 1 1.4-1.285 3.321 3.321 0 0 1 2-.519 3.25 3.25 0 0 1 2.378.961c.42.43.744.93.961 1.481a3.259 3.259 0 0 1 .184 2.164 3.327 3.327 0 0 1-.946 2.007c-.43.46-.961.8-1.547 1a3.254 3.254 0 0 1-2.221.366 3.341 3.341 0 0 1-2.133-1.077c-.43-.49-.744-1.06-.946-1.684a3.273 3.273 0 0 1 .351-2.492m1.85 3.518a1.844 1.844 0 0 0 1.23.633 1.82 1.82 0 0 0 1.342-.519c.35-.35.6-77.787.75-1.285a1.802 1.802 0 0 0 .12-1.264 1.841 1.841 0 0 0-.583-1.23 1.815 1.815 0 0 0-1.327-.55c-.46 0-.895.18-1.214.5a1.83 1.83 0 0 0-.766 1.31c-.09.476-.046 1.1.135 1.577a1.85 1.85 0 0 0 .893 1.278"
      fill="currentColor"
    />
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
