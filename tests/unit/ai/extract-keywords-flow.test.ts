
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractKeywords, ExtractKeywordsInput, ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';

// Declare the mock function variable first.
let mockPromptFn: any;

// Now, set up the mock. Vitest hoists this, so mockPromptFn needs to be accessible.
vi.mock('@/ai/genkit', () => ({
  ai: {
    defineFlow: vi.fn((config, fn) => fn),
    // The factory function will now have access to the mockPromptFn variable in the outer scope.
    definePrompt: vi.fn().mockImplementation(() => mockPromptFn),
  },
}));


describe('extractKeywordsFlow', () => {
  beforeEach(() => {
    // Define the mock's behavior before each test.
    mockPromptFn = vi.fn().mockResolvedValue({
      output: { keywords: ['test', 'gratitude', 'journey'] }
    });
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    expect(result.keywords).toEqual([]);
    // Check that the prompt function itself was not executed
    expect(mockPromptFn).not.toHaveBeenCalled();
  });

  it('should call the AI prompt and return keywords for valid text', async () => {
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    // Check that the prompt function was executed
    expect(mockPromptFn).toHaveBeenCalledWith(input);
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
