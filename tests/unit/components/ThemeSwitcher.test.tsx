
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

// Use vi.mock to replace the module entirely. This will be hoisted.
vi.mock('next-themes', async () => {
  const originalModule = await vi.importActual<typeof NextThemes>('next-themes');
  return {
    ...originalModule,
    useTheme: () => ({
      setTheme: mockSetTheme,
      theme: 'light',
      themes: ['light', 'dark', 'theme-sunrise'],
    }),
  };
});


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
    
    // Wait for the menu to appear, then check the items
    const menu = await screen.findByRole('menu');
    
    const lightThemeItem = screen.getByText('Clair').closest('div[role="menuitem"]');
    const darkThemeItem = screen.getByText('Sombre').closest('div[role="menuitem"]');
    
    expect(lightThemeItem).toBeInTheDocument();
    expect(darkThemeItem).toBeInTheDocument();
    
    expect(lightThemeItem).not.toHaveAttribute('aria-disabled', 'true');
    expect(darkThemeItem).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should call setTheme when a theme is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    const darkThemeItem = await screen.findByText('Sombre');
    fireEvent.click(darkThemeItem);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should show themes as locked if required badge is not present', async () => {
    // No badges unlocked in local storage
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify({ unlockedBadges: [] }));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    const sunriseThemeItem = await screen.findByText('Aurore');
    expect(sunriseThemeItem.closest('div[role="menuitem"]')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show themes as unlocked if required badge is present', async () => {
    const mockState: Partial<GratitudeState> = { unlockedBadges: ['entry-1'] };
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify(mockState));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    const sunriseThemeItem = await screen.findByText('Aurore');
    expect(sunriseThemeItem.closest('div[role="menuitem"]')).not.toHaveAttribute('aria-disabled', 'true');

    // Verify it's clickable
    fireEvent.click(sunriseThemeItem);
    expect(mockSetTheme).toHaveBeenCalledWith('theme-sunrise');
  });

  it('should not call setTheme if a locked theme is clicked', async () => {
    localStorageMock.setItem('gratitudeChallengeData', JSON.stringify({ unlockedBadges: [] }));

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));
    
    // Wait for the menu, then get the item
    await screen.findByRole('menu');
    const sunriseItem = screen.getByText('Aurore');
    
    fireEvent.click(sunriseItem);
    
    expect(mockSetTheme).not.toHaveBeenCalled();
  });

});
