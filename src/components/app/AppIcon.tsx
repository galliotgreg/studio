
"use client";

import { cn } from "@/lib/utils";

export const AppIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-8 h-8", className)}
      {...props}
    >
      {/* Notebook Body */}
      <path d="M8 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H8C6.89543 22 6 21.1046 6 20V6C6 4.89543 6.89543 4 8 4Z" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      
      {/* Notebook Rings */}
      <circle cx="6" cy="8" r="1" fill="hsl(var(--foreground))" />
      <circle cx="6" cy="12" r="1" fill="hsl(var(--foreground))" />
      <circle cx="6" cy="16" r="1" fill="hsl(var(--foreground))" />

      {/* Checkmark */}
      <path d="M10 13L12 15L16 11" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
      
      {/* Leaves */}
      <path d="M14 4C14 2 12 1 12 1S10 2 10 4C10 6 14 6 14 4Z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
      <path d="M12 4C12 2 14 1 14 1S16 2 16 4C16 6 12 6 12 4Z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
    </svg>
);
