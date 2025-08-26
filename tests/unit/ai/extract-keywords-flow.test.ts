
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractKeywords, type ExtractKeywordsInput, type ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';
import { ai } from '@/ai/genkit';

// This mock needs to be hoisted before imports, so we use vi.mock at the top level.
// We declare mockPromptFn here so it's in scope for the mock factory.
let mockPromptFn: any;

vi.mock('@/ai/genkit', () => {
    // The factory function is now where we define the mock's behavior.
    mockPromptFn = vi.fn().mockResolvedValue({
      output: { keywords: ['test', 'gratitude', 'journey'] }
    });
    return {
        ai: {
            definePrompt: vi.fn().mockReturnValue(mockPromptFn),
            defineFlow: vi.fn().mockImplementation((_, fn) => fn), // Pass through the flow function
        }
    };
});

describe('extractKeywordsFlow', () => {

  beforeEach(() => {
    // Clear mock history before each test
    vi.clearAllMocks();
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    
    expect(result.keywords).toEqual([]);
    // The actual prompt function should not be called because of the early return
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

