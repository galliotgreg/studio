import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsletterSignupCard } from '@/components/app/NewsletterSignupCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v.toString(); },
    clear: () => { store = {}; },
    removeItem: (k: string) => { delete store[k]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const renderCard = (props = {}) =>
  render(
    <LanguageProvider>
      <NewsletterSignupCard {...props} />
      <Toaster />
    </LanguageProvider>
  );

describe('NewsletterSignupCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders the email input and CTA', () => {
    renderCard();
    expect(screen.getByPlaceholderText('ton@email.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /je m'abonne/i })).toBeInTheDocument();
  });

  it('rejects an invalid email without calling the network', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    renderCard();
    fireEvent.change(screen.getByPlaceholderText('ton@email.com'), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /je m'abonne/i }));
    await waitFor(() => {
      expect(screen.getByText(/adresse e-mail semble invalide/i)).toBeInTheDocument();
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('subscribes a valid email and shows the confirmation state', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(((url: string) => {
      if (String(url).includes('integrity-token')) {
        return Promise.resolve(new Response('tok', { status: 200 }));
      }
      return Promise.resolve(new Response('{}', { status: 201 }));
    }) as typeof fetch);

    const onSubscribed = vi.fn();
    renderCard({ onSubscribed });

    fireEvent.change(screen.getByPlaceholderText('ton@email.com'), {
      target: { value: 'greg@greg-ggt.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /je m'abonne/i }));

    await waitFor(() => {
      expect(screen.getByText(/vérifie ta boîte mail/i)).toBeInTheDocument();
    });
    expect(onSubscribed).toHaveBeenCalledOnce();
  });

  it('shows the completion variant copy', () => {
    renderCard({ variant: 'completion' });
    expect(screen.getByText(/30 jours tenus/i)).toBeInTheDocument();
  });

  it('calls onDismiss when the close button is clicked', () => {
    const onDismiss = vi.fn();
    renderCard({ onDismiss });
    fireEvent.click(screen.getByRole('button', { name: /fermer/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
