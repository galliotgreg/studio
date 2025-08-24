
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
      <path d="M18.32 0S24 5.68 24 12c0 6.32-5.68 12-12 12S0 18.32 0 12c0-6.32 5.68-12 12-12s3.83.43 6.32 1.27c-.23-.08-1.12-.4-1.12-.4s-.46.36-1.04.53c-1.3.38-2.61.54-3.87.54-5.22 0-9.47 4.25-9.47 9.47s4.25 9.47 9.47 9.47 9.47-4.25 9.47-9.47c0-2.03-.64-3.9-1.73-5.46-.2-.28-.4-.55-.63-.8-.33-.36-.68-.7-1.05-1.02-.3-.25-.6-.5-.9-.72-.34-.23-.68-.45-1.02-.64-.2-.1-.4-.2-.6-.28-.27-.12-.55-.22-.82-.32-.28-.1-.56-.2-.84-.28-.2-.06-.4-.12-.6-.17-.3-.07-.6-.14-.9-.2-.2-.04-.4-.08-.6-.12-.3-.06-.6-.1-.9-.15-.2-.03-.4-.06-.6-.08-.3-.04-.6-.08-.9-.1-.2-.02-.4-.03-.6-.04-.3-.02-.6-.04-.9-.04-.15 0-.3 0-.44-.01-.3-.02-.6-.02-.9-.02s-.6 0-.9.02c-.15 0-.3.01-.44.01-.3 0-.6.02-.9.04-.2 0-.4.02-.6.04-.3 0-.6.06-.9.1-.2.03-.4.07-.6.12-.3.05-.6.1-.9.15-.2.05-.4.1-.6.17-.28.08-.56.17-.84.28-.27.1-.55.2-.82.32-.2.08-.4.17-.6.28-.34.19-.68.4-.1.02.64-.3.26-.6.45-1.02.72-.37.32-.72.68-1.05 1.02-.23.25-.43.52-.63.8-1.09 1.56-1.73 3.43-1.73 5.46 0 5.22-4.25 9.47-9.47 9.47S2.53 17.22 2.53 12 6.78 2.53 12 2.53c1.26 0 2.57.16 3.87.54.58.17 1.04.53 1.04.53s.89-.32 1.12-.4C14.49.43 12 0 12 0S5.68 0 0 5.68C0 12.32 5.68 24 12 24s12-5.68 12-12c0-6.32-5.68-12-12-12z" />
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
