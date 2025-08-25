
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { GratitudeCard } from '@/components/app/GratitudeCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';
import fr from '@/lib/locales/fr.json';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
      <Toaster />
    </LanguageProvider>
  );
};

describe('GratitudeCard', () => {
  const mockOnEntrySubmit = vi.fn();

  test('renders the form when not submitted today', () => {
    renderWithProvider(
      <GratitudeCard
        prompt="Pour quoi êtes-vous reconnaissant(e) ?"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    expect(screen.getByText(fr.dailyGratitude.replace('{day}', '1'))).toBeInTheDocument();
    expect(screen.getByText('"Pour quoi êtes-vous reconnaissant(e) ?"')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(fr.gratitudePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: fr.saveGratitude })).toBeInTheDocument();
  });

  test('renders the submitted view when an entry has been made today', () => {
    renderWithProvider(
      <GratitudeCard
        prompt="Pour quoi êtes-vous reconnaissant(e) ?"
        day={2}
        isSubmittedToday={true}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    expect(screen.getByText(fr.submittedTitle)).toBeInTheDocument();
    expect(screen.getByText(fr.submittedDescription)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: fr.saveGratitude })).not.toBeInTheDocument();
  });

  test('shows a validation error for entries that are too short', async () => {
    renderWithProvider(
      <GratitudeCard
        prompt="Une incitation"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    const textarea = screen.getByPlaceholderText(fr.gratitudePlaceholder);
    const submitButton = screen.getByRole('button', { name: fr.saveGratitude });

    fireEvent.change(textarea, { target: { value: 'court' } });
    fireEvent.click(submitButton);

    // Use findByText for async validation messages
    expect(await screen.findByText(fr.entryTooShort)).toBeInTheDocument();
    expect(mockOnEntrySubmit).not.toHaveBeenCalled();
  });
  
  test('calls onEntrySubmit with the correct text when form is valid', async () => {
    const handleSubmit = vi.fn();
    renderWithProvider(
      <GratitudeCard
        prompt="Une incitation"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={handleSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText(fr.gratitudePlaceholder);
    const submitButton = screen.getByRole('button', { name: fr.saveGratitude });
    const validEntry = 'Ceci est une entrée suffisamment longue pour le test.';

    fireEvent.change(textarea, { target: { value: validEntry } });
    fireEvent.click(submitButton);
    
    // Check if the validation message is NOT there
    expect(screen.queryByText(fr.entryTooShort)).not.toBeInTheDocument();

    // Check if the submit handler was called
    expect(handleSubmit).toHaveBeenCalledWith(validEntry);
  });
});
