
export interface Theme {
  id: string; 
  nameKey: string;
}

export const THEMES: Theme[] = [
    {
      id: 'default',
      nameKey: 'theme.modern',
    },
     {
      id: 'grimoire',
      nameKey: 'theme.grimoire',
    },
];
