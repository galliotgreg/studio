
import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

import { JournalEntryCard } from '@/components/app/JournalEntryCard';
import { LanguageProvider, useLanguage } from '@/components/app/LanguageProvider';
import type { GratitudeEntry } from '@/lib/types';

const mockEntry: GratitudeEntry = {
  day: 5,
  date: '2024-07-26T10:00:00.000Z',
  text: 'I am grateful for the sunny weather today.',
  prompt: 'What made you smile today?',
};

// Helper to render with the real provider
const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <LanguageProvider>
            {ui}
        </LanguageProvider>
    );
};

// Mock LanguageProvider to control the language for testing
const TestLanguageWrapper = ({ children, lang }: { children: React.ReactNode, lang: 'en' | 'fr'}) => {
    const { setLanguage } = useLanguage();
    React.useEffect(() => {
        setLanguage(lang);
    }, [lang, setLanguage]);
    return <>{children}</>;
};

describe('JournalEntryCard', () => {

    afterEach(() => {
        cleanup();
    });

    it('should render the entry details correctly in French by default', () => {
        renderWithProvider(<JournalEntryCard entry={mockEntry} />);

        const formattedDate = format(new Date(mockEntry.date), 'PPP', { locale: fr });
        
        expect(screen.getByText((content, element) => content.startsWith('Jour 5') && content.includes(formattedDate))).toBeInTheDocument();
        expect(screen.getByText(mockEntry.prompt)).toBeInTheDocument();
        expect(screen.getByText(mockEntry.text)).toBeInTheDocument();
    });
    
    it('should format the date correctly when language is switched to English', () => {
        render(
            <LanguageProvider>
                <TestLanguageWrapper lang="en">
                    <JournalEntryCard entry={mockEntry} />
                </TestLanguageWrapper>
            </LanguageProvider>
        );

        const formattedDate = format(new Date(mockEntry.date), 'PPP', { locale: enUS });
        
        expect(screen.getByText((content, element) => content.startsWith('Day 5') && content.includes(formattedDate))).toBeInTheDocument();
    });
});
