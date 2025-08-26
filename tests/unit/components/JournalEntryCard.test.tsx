
import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

import { JournalEntryCard } from '@/components/app/JournalEntryCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import type { GratitudeEntry } from '@/lib/types';

const mockEntry: GratitudeEntry = {
  day: 5,
  date: '2024-07-26T10:00:00.000Z',
  text: 'I am grateful for the sunny weather today.',
  prompt: 'What made you smile today?',
};

// Helper to render with provider
const renderWithProvider = (ui: React.ReactElement, lang: 'en' | 'fr' = 'fr') => {
    return render(
        <LanguageProvider>
            {React.cloneElement(ui, { ...ui.props, language: lang })}
        </LanguageProvider>
    );
};

// Mock LanguageProvider to control the language for testing
vi.mock('@/components/app/LanguageProvider', () => {
    const originalModule = vi.importActual('@/components/app/LanguageProvider');
    const LanguageContext = React.createContext({
      language: 'fr', // default to french for most tests
      setLanguage: () => {},
      t: (key: string) => {
        const fr_translations: {[key: string]: string} = {
            "dailyGratitude": "Jour {day} : Gratitude Quotidienne",
        };
        const en_translations: {[key: string]: string} = {
            "dailyGratitude": "Day {day}: Daily Gratitude",
        };
        
        // This is a simplified t function for testing purposes
        const language = (globalThis as any).__vitest_language || 'fr';
        const translations = language === 'fr' ? fr_translations : en_translations;
        return translations[key] || key;
      },
    });

    return {
        ...originalModule,
        useLanguage: () => React.useContext(LanguageContext),
    };
});


describe('JournalEntryCard', () => {

    afterEach(() => {
        cleanup();
        (globalThis as any).__vitest_language = 'fr'; // Reset language after each test
    });

    it('should render the entry details correctly in French', () => {
        (globalThis as any).__vitest_language = 'fr';
        render(<JournalEntryCard entry={mockEntry} />);

        const formattedDate = format(new Date(mockEntry.date), 'PPP', { locale: fr });
        
        expect(screen.getByText(`Jour 5 - ${formattedDate}`)).toBeInTheDocument();
        expect(screen.getByText(mockEntry.prompt)).toBeInTheDocument();
        expect(screen.getByText(mockEntry.text)).toBeInTheDocument();
    });
    
    it('should format the date correctly when language is switched to English', () => {
        (globalThis as any).__vitest_language = 'en';
        render(<JournalEntryCard entry={mockEntry} />);

        const formattedDate = format(new Date(mockEntry.date), 'PPP', { locale: enUS });
        
        expect(screen.getByText(`Day 5 - ${formattedDate}`)).toBeInTheDocument();
    });
});
