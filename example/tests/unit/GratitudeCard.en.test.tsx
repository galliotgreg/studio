
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi } from 'vitest';
import { GratitudeCard } from '@/components/app/GratitudeCard';
import { LanguageProvider, useLanguage } from '@/components/app/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';
import en from '@/lib/locales/en.json';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setLanguage } = useLanguage();
  React.useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);
  return <>{children}</>;
};


const renderInEnglish = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <TestWrapper>{ui}</TestWrapper>
      <Toaster />
    </LanguageProvider>
  );
};

describe('GratitudeCard in English', () => {
  const mockOnEntrySubmit = vi.fn();

  test('renders the form with English text', () => {
    renderInEnglish(
      <GratitudeCard
        prompt="What are you grateful for?"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    // Check for English text based on en.json
    expect(screen.getByText(en.dailyGratitude.replace('{day}', '1'))).toBeInTheDocument();
    expect(screen.getByText('"What are you grateful for?"')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(en.gratitudePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(en.saveGratitude) })).toBeInTheDocument();
  });
  
  test('shows submitted view with English text', () => {
    renderInEnglish(
      <GratitudeCard
        prompt="What are you grateful for?"
        day={2}
        isSubmittedToday={true}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    expect(screen.getByText(en.submittedTitle)).toBeInTheDocument();
    expect(screen.getByText(en.submittedDescription)).toBeInTheDocument();
  });

  test('shows validation error with English text', async () => {
    renderInEnglish(
      <GratitudeCard
        prompt="A prompt"
        day={1}
        isSubmittedToday={false}
        onEntrySubmit={mockOnEntrySubmit}
      />
    );

    const textarea = screen.getByPlaceholderText(en.gratitudePlaceholder);
    const submitButton = screen.getByRole('button', { name: new RegExp(en.saveGratitude) });

    await userEvent.type(textarea, 'short');
    await userEvent.click(submitButton);

    expect(await screen.findByText(en.entryTooShort)).toBeInTheDocument();
    expect(mockOnEntrySubmit).not.toHaveBeenCalled();
  });
});
