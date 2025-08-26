
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as aiFlow from '@/ai/flows/extract-keywords-flow';

describe('extractKeywordsFlow', () => {
  let extractKeywordsSpy: any;

  beforeEach(() => {
    // Spy on the flow function itself within the module
    extractKeywordsSpy = vi.spyOn(aiFlow, 'extractKeywordsFlow').mockResolvedValue({
        output: { keywords: ['test', 'gratitude', 'journey'] }
    });
  });

  afterEach(() => {
    // Restore the original implementation after each test
    vi.restoreAllMocks();
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: aiFlow.ExtractKeywordsInput = { text: '   ' };
    const result: aiFlow.ExtractKeywordsOutput = await aiFlow.extractKeywords(input);
    expect(result.keywords).toEqual([]);
    // The actual flow function (the one making the AI call) should not be called
    expect(extractKeywordsSpy).not.toHaveBeenCalled();
  });

  it('should call the AI flow and return keywords for valid text', async () => {
    const input: aiFlow.ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    
    // We need to re-mock for this specific test case because the actual implementation of the flow is what we want to test
    extractKeywordsSpy.mockImplementation(async (input) => {
        return { keywords: ['test', 'gratitude', 'journey'] };
    });

    const result: aiFlow.ExtractKeywordsOutput = await aiFlow.extractKeywords(input);

    expect(extractKeywordsSpy).toHaveBeenCalledWith(input);
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
