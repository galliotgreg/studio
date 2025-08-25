import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { BadgesCard } from '@/components/app/BadgesCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { BADGES } from '@/lib/data';

// Mock Lucide icons
vi.mock('lucide-react', async () => {
    const original = await vi.importActual('lucide-react');
    return {
        ...original,
        Star: () => <svg data-testid="star-icon" />,
        Award: () => <svg data-testid="award-icon" />,
        Zap: () => <svg data-testid="zap-icon" />,
        Trophy: () => <svg data-testid="trophy-icon" />,
        Crown: () => <svg data-testid="crown-icon" />,
        BookMarked: () => <svg data-testid="book-icon" />,
    };
});

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <LanguageProvider>{ui}</LanguageProvider>
    );
};

describe('BadgesCard', () => {
    test('renders all badges, some locked and some unlocked', () => {
        const unlockedBadgeIds = ['entry-1', 'streak-3'];
        renderWithProvider(<BadgesCard allBadges={BADGES} unlockedBadgeIds={unlockedBadgeIds} />);

        // Check title
        expect(screen.getByText('My Badges')).toBeInTheDocument();

        const badgeElements = screen.getAllByRole('img', { hidden: true });
        expect(badgeElements.length).toBe(BADGES.length);

        // Check if unlocked badges have full opacity
        const firstStepBadge = screen.getByTestId('star-icon').closest('div');
        const consistentHeartBadge = screen.getByTestId('award-icon').closest('div');
        expect(firstStepBadge).not.toHaveClass('opacity-30');
        expect(consistentHeartBadge).not.toHaveClass('opacity-30');

        // Check if a locked badge is greyed out
        const weeklyWarriorBadge = screen.getByTestId('trophy-icon').closest('div');
        expect(weeklyWarriorBadge).toHaveClass('opacity-30');
        expect(weeklyWarriorBadge).toHaveClass('grayscale');
    });
});
