
"use client";

import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const AppIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Logo className={cn("w-8 h-8", className)} {...props} />
);
