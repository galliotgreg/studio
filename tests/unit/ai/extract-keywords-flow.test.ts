import { describe, it, expect, vi } from 'vitest';
import { extractKeywords, ExtractKeywordsInput, ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';


vi.mock('@/ai/genkit', () => ({
  ai: {
    defineFlow: vi.fn((config, fn) => fn),
    definePrompt: vi.fn().mockImplementation(() => 
      vi.fn().mockResolvedValue({
        output: { keywords: ['test', 'gratitude', 'journey'] }
      })
    ),
  },
}));

describe('extractKeywordsFlow', () => {
  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    expect(result.keywords).toEqual([]);
    expect(ai.definePrompt).not.toHaveBeenCalled();
  });

  it('should call the AI prompt and return keywords for valid text', async () => {
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    expect(ai.definePrompt).toHaveBeenCalled();
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
