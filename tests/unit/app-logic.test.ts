import { expect, test, describe } from 'vitest';
import type { GratitudeState, GratitudeEntry, Badge } from '@/lib/types';
import { BADGES } from '@/lib/data';

// Helper function to create a date string for a specific day offset
const getDateString = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString();
};

// This function simulates the core logic of adding a new entry
// It's extracted from the page.tsx component to be testable
function addGratitudeEntry(
    currentState: GratitudeState, 
    newEntryText: string, 
    prompt: string,
    submissionDate: Date // Allow passing a submission date for testing
): GratitudeState {
    if (!newEntryText.trim() || newEntryText.length < 10) {
        // In the real app, this would be handled by form validation,
        // but for testing the logic, we just return the state unchanged.
        return currentState;
    }

    const newEntry: GratitudeEntry = {
        day: currentState.currentDay,
        date: submissionDate.toISOString(),
        text: newEntryText,
        prompt: prompt,
    };

    const yesterday = new Date(submissionDate);
    yesterday.setDate(submissionDate.getDate() - 1);
    
    const lastEntryDate = currentState.lastEntryDate ? new Date(currentState.lastEntryDate) : null;
    
    const newStreak = lastEntryDate?.toDateString() === yesterday.toDateString() 
        ? currentState.streak + 1 
        : 1;

    const newPoints = currentState.points + 10 + (newStreak > 1 ? 5 * (newStreak - 1) : 0);
    const newCurrentDay = currentState.currentDay < 30 ? currentState.currentDay + 1 : currentState.currentDay;

    const newEntries = [...currentState.entries, newEntry];

    const newUnlockedBadges = [...currentState.unlockedBadges];
    BADGES.forEach((badge: Badge) => {
        const isUnlocked = badge.type === 'streak' 
            ? newStreak >= badge.milestone 
            : newEntries.length >= badge.milestone;
        if (isUnlocked && !newUnlockedBadges.includes(badge.id)) {
            newUnlockedBadges.push(badge.id);
        }
    });

    return {
        entries: newEntries,
        currentDay: newCurrentDay,
        streak: newStreak,
        points: newPoints,
        unlockedBadges: newUnlockedBadges,
        lastEntryDate: submissionDate.toISOString(),
    };
}


describe('Gratitude App Logic', () => {
    const initialState: GratitudeState = {
        entries: [],
        currentDay: 1,
        streak: 0,
        points: 0,
        unlockedBadges: [],
        lastEntryDate: null,
    };

    test('should add a new entry and update stats correctly', () => {
        const today = new Date();
        const newState = addGratitudeEntry(initialState, 'This is a valid gratitude entry.', 'Test Prompt', today);
        
        expect(newState.entries.length).toBe(1);
        expect(newState.entries[0].text).toBe('This is a valid gratitude entry.');
        expect(newState.currentDay).toBe(2);
        expect(newState.streak).toBe(1);
        expect(newState.points).toBe(10);
        expect(newState.lastEntryDate).not.toBeNull();
    });

    test('should increment streak for consecutive days', () => {
        // First entry (yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const stateAfterDay1: GratitudeState = {
            ...initialState,
            entries: [{ day: 1, date: yesterday.toISOString(), text: 'Yesterday\'s entry', prompt: 'P1'}],
            currentDay: 2,
            streak: 1,
            points: 10,
            lastEntryDate: yesterday.toISOString(),
        };

        // Second entry (today)
        const today = new Date();
        const stateAfterDay2 = addGratitudeEntry(stateAfterDay1, 'Today\'s entry is also valid.', 'P2', today);

        expect(stateAfterDay2.streak).toBe(2);
        expect(stateAfterDay2.points).toBe(10 + 10 + 5); // 10 (base) + 10 (today) + 5 (streak bonus)
        expect(stateAfterDay2.currentDay).toBe(3);
    });

    test('should reset streak if a day is missed', () => {
        // First entry (two days ago)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const stateAfterDay1: GratitudeState = {
            ...initialState,
            entries: [{ day: 1, date: twoDaysAgo.toISOString(), text: 'Two days ago entry', prompt: 'P1' }],
            currentDay: 2,
            streak: 1,
            points: 10,
            lastEntryDate: twoDaysAgo.toISOString(),
        };

        // Second entry (today)
        const today = new Date();
        const stateAfterDay2 = addGratitudeEntry(stateAfterDay1, 'Today\'s entry after a missed day.', 'P2', today);

        expect(stateAfterDay2.streak).toBe(1); // Streak resets
        expect(stateAfterDay2.points).toBe(10 + 10); // 10 (base) + 10 (today), no streak bonus
    });
    
    test('should unlock badges based on entries count', () => {
        let state = initialState;
        // Simulate 10 entries
        for (let i = 1; i <= 10; i++) {
            const entryDate = new Date();
            entryDate.setDate(entryDate.getDate() - (10 - i));
            state = addGratitudeEntry(state, `Entry number ${i} is long enough.`, `Prompt ${i}`, entryDate);
        }
        
        expect(state.unlockedBadges).toContain('entry-1');
        expect(state.unlockedBadges).toContain('entry-10');
        expect(state.unlockedBadges).not.toContain('streak-21');
    });

    test('should unlock badges based on streak', () => {
        let state = initialState;
        // Simulate a 7-day streak
        for (let i = 1; i <= 7; i++) {
            const entryDate = new Date();
            // Simulate entries on consecutive days leading up to today
            entryDate.setDate(new Date().getDate() - (7 - i));
            state = addGratitudeEntry(state, `Streak entry ${i} is long enough.`, `Prompt ${i}`, entryDate);
        }
        
        expect(state.streak).toBe(7);
        expect(state.unlockedBadges).toContain('streak-3');
        expect(state.unlockedBadges).toContain('streak-7');
        expect(state.unlockedBadges).not.toContain('streak-30');
    });
});
