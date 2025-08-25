import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProgressCard } from '@/components/app/ProgressCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';

test('ProgressCard renders correctly', () => {
  render(
    <LanguageProvider>
      <ProgressCard currentDay={15} totalDays={30} />
    </LanguageProvider>
  );

  // Check the title
  expect(screen.getByText('Challenge Progress')).toBeInTheDocument();

  // Check the description text
  expect(screen.getByText('You are on day 15 of your 30-day journey.')).toBeInTheDocument();

  // Check the percentage display
  expect(screen.getByText('50%')).toBeInTheDocument();

  // Check the progress bar's aria-valuenow attribute
  const progressBar = screen.getByRole('progressbar');
  expect(progressBar).toHaveAttribute('aria-valuenow', '50');
});

test('ProgressCard handles completion', () => {
    render(
      <LanguageProvider>
        <ProgressCard currentDay={30} totalDays={30} />
      </LanguageProvider>
    );
  
    expect(screen.getByText('100%')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
});
