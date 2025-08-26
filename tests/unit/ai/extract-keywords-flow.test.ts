
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractKeywords, type ExtractKeywordsInput, type ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';

// We define the mock prompt function here, and it will be captured by the mock factory below.
const mockPromptFn = vi.fn().mockResolvedValue({
  output: { keywords: ['test', 'gratitude', 'journey'] }
});

// This mock needs to be hoisted before imports, so we use vi.mock at the top level.
vi.mock('@/ai/genkit', () => {
    return {
        ai: {
            definePrompt: vi.fn().mockReturnValue(mockPromptFn),
            // The flow function itself is passed through, so we can test its internal logic.
            defineFlow: vi.fn().mockImplementation((_, fn) => fn), 
        }
    };
});

describe('extractKeywordsFlow', () => {

  beforeEach(() => {
    // Clear mock history before each test to ensure a clean slate
    vi.clearAllMocks();
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    
    expect(result.keywords).toEqual([]);
    // The actual prompt function should not have been called due to the early return logic.
    expect(mockPromptFn).not.toHaveBeenCalled();
  });

  it('should call the AI flow and return keywords for valid text', async () => {
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    // The prompt function should be called with the correct input
    expect(mockPromptFn).toHaveBeenCalledWith(input);
    // The result should be the mocked output
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
