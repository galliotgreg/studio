
"use client";

import { Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const BlueskyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="currentColor"
    >
      <path d="M12.003 1.25c-2.31.02-4.254 1.63-4.83 3.82.22-.03.44-.05.67-.05 3.98 0 7.21 3.23 7.21 7.21 0 .34-.03.67-.07.99 2.5-1.07 4.13-3.64 4.13-6.52 0-3.98-3.23-7.21-7.21-7.21h.1zm-1.07 20.3s.47.45.8.45c.49 0 .8-.45.8-.45l.13-.15c.34-1.2.98-3.53 1.95-6.1.4-.95 1.05-2.58 2.03-4.57 2.9-5.78 4.2-8.47 4.2-10.3 0-1.04-.85-1.89-1.89-1.89h-.09c-1.39.06-3.88 1.67-7.21 7.02-.97 1.5-1.76 3.32-2.32 4.7-1.42 3.52-2.45 6.13-2.6 6.5l.23.24zm-1.36-1.35c.39 1.15 1.03 3.39 1.93 5.86.13-1.88.54-4.58 1.27-7.5.38-1.53 1.02-3.83 1.96-5.87.53-1.16 1.17-2.36 1.88-3.53-2.9-1.68-4.9-2.03-5.6-.2-.35.92 1.91 5.66-1.44 11.24z"/>
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
