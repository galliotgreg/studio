import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { JournalEntryCard } from '@/components/app/JournalEntryCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import type { GratitudeEntry } from '@/lib/types';
import { format } from "date-fns";
import { fr } from "date-fns/locale";


describe('JournalEntryCard', () => {
  const entry: GratitudeEntry = {
    day: 5,
    date: '2024-01-01T12:00:00.000Z',
    text: 'I am grateful for my family.',
    prompt: 'Who are you grateful for and why?',
  };

  test('renders entry details correctly', () => {
    render(
      <LanguageProvider>
        <JournalEntryCard entry={entry} />
      </LanguageProvider>
    );
    
    // Format the date using the French locale to match the component's output
    const formattedDate = format(new Date(entry.date), 'PPP', { locale: fr });

    expect(screen.getByText(`Day 5 - ${formattedDate}`)).toBeInTheDocument();
    expect(screen.getByText(entry.prompt)).toBeInTheDocument();
    expect(screen.getByText(entry.text)).toBeInTheDocument();
  });
});
