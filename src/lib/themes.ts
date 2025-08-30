
export interface Theme {
  id: string; 
  nameKey: string;
  unlockBadgeId?: string; // Optional: Retained for potential future use, but not currently used.
}

export const THEMES: Theme[] = [
    {
      id: 'default',
      nameKey: 'theme.modern',
    },
     {
      id: 'grimoire',
      nameKey: 'theme.grimoire',
      unlockBadgeId: 'entry-1', // Keep for now, but logic is disabled.
    },
];
