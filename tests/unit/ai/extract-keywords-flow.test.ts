
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractKeywords } from '@/ai/flows/extract-keywords-flow';
import type { ExtractKeywordsInput, ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';

// We mock the AI dependency to prevent actual API calls during tests.
const mockPromptFn = vi.fn().mockResolvedValue({
  output: { keywords: ['test', 'gratitude', 'journey'] }
});

vi.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: vi.fn(() => mockPromptFn),
  },
}));

describe('extractKeywordsFlow', () => {

  beforeEach(() => {
    // Clear mock history before each test
    vi.clearAllMocks();
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    
    expect(result.keywords).toEqual([]);
    // The actual prompt function should not have been called.
    expect(mockPromptFn).not.toHaveBeenCalled();
  });

  it('should call the AI flow and return keywords for valid text', async () => {
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    // The prompt function should be called with the correct input.
    expect(mockPromptFn).toHaveBeenCalledWith(input);
    
    // The result should be the mocked output.
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
