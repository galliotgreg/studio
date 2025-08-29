
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WordCloudCard } from '@/components/app/WordCloudCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { GratitudeEntry } from '@/lib/types';
import * as aiFlow from '@/ai/flows/extract-keywords-flow';

// Mock the AI flow
vi.mock('@/ai/flows/extract-keywords-flow', () => ({
  extractKeywords: vi.fn(),
}));

const mockEntries: GratitudeEntry[] = [
  { day: 1, date: '2024-01-01', text: 'Grateful for the sun', prompt: '' },
  { day: 2, date: '2024-01-02', text: 'Grateful for my family and the sun', prompt: '' },
];

const mockKeywords = { keywords: ['sun', 'family', 'grateful'] };

describe('WordCloudCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render if there are no entries', () => {
    render(
      <LanguageProvider>
        <WordCloudCard entries={[]} />
      </LanguageProvider>
    );
    expect(screen.queryByText(/votre nuage de gratitude/i)).not.toBeInTheDocument();
  });

  it('should show a loading skeleton initially', async () => {
    vi.mocked(aiFlow.extractKeywords).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <LanguageProvider>
        <WordCloudCard entries={mockEntries} />
      </LanguageProvider>
    );
    
    // Check that the loader is there while the promise is pending
    await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });


  it('should display the word cloud after fetching keywords', async () => {
    vi.mocked(aiFlow.extractKeywords).mockResolvedValue(mockKeywords);
    render(
      <LanguageProvider>
        <WordCloudCard entries={mockEntries} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    expect(screen.getByText('sun')).toBeInTheDocument();
    expect(screen.getByText('family')).toBeInTheDocument();
    expect(screen.getByText('grateful')).toBeInTheDocument();
  });

  it('should show "no entries" message if keyword extraction fails or returns nothing', async () => {
    vi.mocked(aiFlow.extractKeywords).mockResolvedValue({ keywords: [] });
    render(
      <LanguageProvider>
        <WordCloudCard entries={[{ day: 1, date: '2024-01-01', text: 'a b c', prompt: '' }]} />
      </LanguageProvider>
    );

    await waitFor(() => {
        // The component will initially render local words and then update. 
        // We wait for the final state which should be the message.
        expect(screen.getByText("Le journal est vide")).toBeInTheDocument();
    });
  });
});
