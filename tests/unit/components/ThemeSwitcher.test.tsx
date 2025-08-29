
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeSwitcher } from '@/components/app/ThemeSwitcher';
import { ThemeProvider } from '@/components/app/theme-provider';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import type { GratitudeState } from '@/lib/types';
import * as NextThemes from 'next-themes';

// Mock the useTheme hook from next-themes
const mockSetTheme = vi.fn();
vi.spyOn(NextThemes, 'useTheme').mockImplementation(() => ({
  setTheme: mockSetTheme,
  theme: 'light',
  themes: ['light', 'dark', 'theme-sunrise'],
}));


// Mock localStorage
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


const renderComponent = () => {
    return render(
        <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ThemeSwitcher />
            </ThemeProvider>
        </LanguageProvider>
    );
};

describe('ThemeSwitcher', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should render the theme switcher button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /changer le thème/i })).toBeInTheDocument();
  });

  it('should show basic themes as unlocked by default', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));
    
    await waitFor(() => {
        expect(screen.getByText('Clair')).toBeInTheDocument();
    });
    
    const lightThemeItem = screen.getByText('Clair').closest('div[role="menuitem"]');
    const darkThemeItem = screen.getByText('Sombre').closest('div[role="menuitem"]');
    
    expect(lightThemeItem).not.toHaveAttribute('aria-disabled', 'true');
    expect(darkThemeItem).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should call setTheme when a theme is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Sombre'));
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should show themes as locked if required badge is not present', async () => {
    // No badges unlocked in local storage
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify({ unlockedBadges: [] }));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    await waitFor(() => {
      // Example: 'Aurore' theme requires 'entry-1' badge
      const sunriseThemeItem = screen.getByText('Aurore').closest('div[role="menuitem"]');
      expect(sunriseThemeItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('should show themes as unlocked if required badge is present', async () => {
    const mockState: Partial<GratitudeState> = { unlockedBadges: ['entry-1'] };
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify(mockState));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    await waitFor(() => {
      const sunriseThemeItem = screen.getByText('Aurore').closest('div[role="menuitem"]');
      expect(sunriseThemeItem).not.toHaveAttribute('aria-disabled', 'true');
    });

    // Verify it's clickable
    fireEvent.click(screen.getByText('Aurore'));
    expect(mockSetTheme).toHaveBeenCalledWith('theme-sunrise');
  });

  it('should not call setTheme if a locked theme is clicked', async () => {
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify({ unlockedBadges: [] }));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Aurore'));
    });
    
    expect(mockSetTheme).not.toHaveBeenCalled();
  });

});
