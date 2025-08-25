import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProgressCard } from '@/components/app/ProgressCard';
import { LanguageProvider, useLanguage } from '@/components/app/LanguageProvider';
import fr from '@/lib/locales/fr.json';
import en from '@/lib/locales/en.json';
import React from 'react';

// Wrapper component to provide context and access translation function
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  // Pass t to children or use it here if children don't need it directly
  return <div data-testid="t-function" data-t-challengeProgress={t('challengeProgress')} data-t-progressDescription={t('progressDescription')}>{children}</div>;
};


test('ProgressCard renders correctly', () => {
  render(
    <LanguageProvider>
      <ProgressCard currentDay={15} totalDays={30} />
    </LanguageProvider>
  );

  // Since default language is french, we check for french text.
  expect(screen.getByText(fr.challengeProgress)).toBeInTheDocument();
  expect(screen.getByText(fr.progressDescription.replace('{day}', '15').replace('{totalDays}', '30'))).toBeInTheDocument();

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
    expect(screen.getByText(fr.progressDescription.replace('{day}', '30').replace('{totalDays}', '30'))).toBeInTheDocument();
});
