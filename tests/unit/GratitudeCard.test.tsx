import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { GratitudeCard } from '@/components/app/GratitudeCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';

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
        prompt="What are you grateful for?"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    expect(screen.getByText('Day 1: Daily Gratitude')).toBeInTheDocument();
    expect(screen.getByText('"What are you grateful for?"')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What are you grateful for today? Write at least one thing...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save My Gratitude/i })).toBeInTheDocument();
  });

  test('renders the submitted view when an entry has been made today', () => {
    renderWithProvider(
      <GratitudeCard
        prompt="What are you grateful for?"
        day={2}
        isSubmittedToday={true}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    expect(screen.getByText("Thank you for your entry!")).toBeInTheDocument();
    expect(screen.getByText("You've completed your gratitude for today. See you tomorrow!")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Save My Gratitude/i })).not.toBeInTheDocument();
  });

  test('shows a validation error for entries that are too short', async () => {
    renderWithProvider(
      <GratitudeCard
        prompt="A prompt"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('What are you grateful for today? Write at least one thing...');
    const submitButton = screen.getByRole('button', { name: /Save My Gratitude/i });

    fireEvent.change(textarea, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    // Use findByText for async validation messages
    expect(await screen.findByText('Your entry must be at least 10 characters.')).toBeInTheDocument();
    expect(mockOnEntrySubmit).not.toHaveBeenCalled();
  });
  
  test('calls onEntrySubmit with the correct text when form is valid', async () => {
    const handleSubmit = vi.fn();
    renderWithProvider(
      <GratitudeCard
        prompt="A prompt"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={handleSubmit}
      />
    );

    const textarea = screen.getByPlaceholderText('What are you grateful for today? Write at least one thing...');
    const submitButton = screen.getByRole('button', { name: /Save My Gratitude/i });
    const validEntry = 'This is a sufficiently long entry for the test.';

    fireEvent.change(textarea, { target: { value: validEntry } });
    fireEvent.click(submitButton);
    
    // Check if the validation message is NOT there
    expect(screen.queryByText('Your entry must be at least 10 characters.')).not.toBeInTheDocument();

    // Check if the submit handler was called
    expect(handleSubmit).toHaveBeenCalledWith(validEntry);
  });
});
