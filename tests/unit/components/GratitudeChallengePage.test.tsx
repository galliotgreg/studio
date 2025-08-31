
import * as React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GratitudeChallengePage from '@/app/page';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';
import * as Toast from '@/hooks/use-toast';
import type { GratitudeState } from '@/lib/types';

// Mock localStorage
const mockState: GratitudeState = {
  entries: [{ day: 1, date: '2024-01-01T10:00:00.000Z', text: 'Test entry', prompt: 'Test prompt' }],
  currentDay: 2,
  streak: 1,
  unlockedBadges: ['entry-1'],
  lastEntryDate: '2024-01-01T10:00:00.000Z',
};

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock other browser APIs
Object.defineProperty(window, 'location', {
    value: {
      reload: vi.fn(),
    },
    writable: true
});

Object.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(),
});
Object.defineProperty(window.URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
});


describe('GratitudeChallengePage - Import/Export', () => {
    
  const toastSpy = vi.spyOn(Toast, 'toast');
    
  beforeEach(() => {
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify(mockState));
    render(
      <LanguageProvider>
        <GratitudeChallengePage />
        <Toaster />
      </LanguageProvider>
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should export data to a JSON file when export button is clicked', async () => {
    const link = {
        href: '',
        download: '',
        click: vi.fn(),
    };

    // Mock the DOM methods used for download
    vi.spyOn(document, 'createElement').mockReturnValue(link as unknown as HTMLAnchorElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});

    await fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    await fireEvent.click(screen.getByText(/exporter les données/i));
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.download).toBe('gratitude-backup.json');
    expect(link.click).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
        title: "Exportation réussie",
    }));
  });

  it('should import data from a valid JSON file', async () => {
    const importedState: GratitudeState = { ...mockState, streak: 100 };
    const file = new File([JSON.stringify(importedState)], 'gratitude-backup.json', { type: 'application/json' });
    const fileInput = screen.getByTestId('file-input');

    await fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    await fireEvent.click(screen.getByText(/importer les données/i));

    await waitFor(() => fireEvent.change(fileInput, { target: { files: [file] } }));
    
    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
        title: "Importation réussie",
      }));
      // We check that reload is called, which would apply the new state
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('should show an error when importing an invalid JSON file', async () => {
    const invalidFile = new File(['invalid json'], 'invalid.json', { type: 'application/json' });
    const fileInput = screen.getByTestId('file-input');

    await fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    await fireEvent.click(screen.getByText(/importer les données/i));

    await waitFor(() => fireEvent.change(fileInput, { target: { files: [invalidFile] } }));

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
        title: "Échec de l'importation",
        variant: 'destructive',
      }));
    });
  });
});
