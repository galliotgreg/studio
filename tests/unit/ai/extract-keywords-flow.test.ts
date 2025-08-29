
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We must define the mock function before it is used in the vi.mock call.
const mockPromptFn = vi.fn();

// We mock the AI dependency to prevent actual API calls during tests.
vi.mock('@/ai/genkit', () => ({
  ai: {
    defineFlow: vi.fn((config, fn) => fn), // Pass through the implementation
    definePrompt: vi.fn(() => mockPromptFn),
  },
}));

// Now we can import the module that uses the mocked dependency.
import { extractKeywords } from '@/ai/flows/extract-keywords-flow';
import type { ExtractKeywordsInput, ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';


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
    mockPromptFn.mockResolvedValue({
      output: { keywords: ['test', 'gratitude', 'journey'] }
    });
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    // The prompt function should be called with the correct input.
    expect(mockPromptFn).toHaveBeenCalledWith(input);
    
    // The result should be the mocked output.
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
