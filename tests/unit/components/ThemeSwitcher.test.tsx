
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
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'theme-sunrise', 'system'],
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

  it('should show the light/dark switch', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));
    
    await screen.findByRole('menu');
    
    expect(screen.getByRole('switch', {name: /toggle dark mode/i})).toBeInTheDocument();
    expect(screen.getByText('Clair')).toBeInTheDocument();
    expect(screen.getByText('Sombre')).toBeInTheDocument();
  });


  it('should call setTheme when the dark mode switch is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /changer le thème/i }));

    const switchControl = await screen.findByRole('switch');
    fireEvent.click(switchControl);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should show themes as locked if required badge is not present', async () => {
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
    
    const menu = await screen.findByRole('menu');
    const sunriseItem = screen.getByText('Aurore');
    
    fireEvent.click(sunriseItem);
    
    expect(mockSetTheme).not.toHaveBeenCalled();
  });

});
