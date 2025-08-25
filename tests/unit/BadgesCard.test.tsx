
import { render, screen, within } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { BadgesCard } from '@/components/app/BadgesCard';
import { LanguageProvider } from '@/components/app/LanguageProvider';
import { BADGES } from '@/lib/data';
import fr from '@/lib/locales/fr.json';

// Mock Lucide icons
vi.mock('lucide-react', async () => {
    const original = await vi.importActual('lucide-react');
    const icons: Record<string, React.FC> = {
        Star: () => <svg data-testid="star-icon" />,
        Award: () => <svg data-testid="award-icon" />,
        Zap: () => <svg data-testid="zap-icon" />,
        Trophy: () => <svg data-testid="trophy-icon" />,
        Crown: () => <svg data-testid="crown-icon" />,
        BookMarked: () => <svg data-testid="bookmarked-icon" />,
    };

    return {
        ...original,
        ...icons
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
        expect(screen.getByText(fr.myBadges)).toBeInTheDocument();

        // Find the container for the list of badges
        const badgeListContainer = screen.getByText(fr.badgesDescription).parentElement?.nextElementSibling;
        expect(badgeListContainer).toBeInTheDocument();

        // Verify that all badge icons are rendered within the list
        if (badgeListContainer) {
            const iconTestIds = ['star-icon', 'award-icon', 'trophy-icon', 'bookmarked-icon', 'zap-icon', 'crown-icon'];
            iconTestIds.forEach(iconTestId => {
                expect(within(badgeListContainer).getByTestId(iconTestId)).toBeInTheDocument();
            });

            // Check if unlocked badges have full opacity
            const firstStepBadge = within(badgeListContainer).getByTestId('star-icon').closest('div.transition-opacity');
            const consistentHeartBadge = within(badgeListContainer).getByTestId('award-icon').closest('div.transition-opacity');
            expect(firstStepBadge).not.toHaveClass('opacity-30');
            expect(consistentHeartBadge).not.toHaveClass('opacity-30');

            // Check if a locked badge is greyed out
            const weeklyWarriorBadge = within(badgeListContainer).getByTestId('trophy-icon').closest('div.transition-opacity');
            expect(weeklyWarriorBadge).toHaveClass('opacity-30');
            expect(weeklyWarriorBadge).toHaveClass('grayscale');
        }
    });
});
