
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractKeywords, extractKeywordsFlow } from '@/ai/flows/extract-keywords-flow';
import type { ExtractKeywordsInput, ExtractKeywordsOutput } from '@/ai/flows/extract-keywords-flow';
import * as aiFlow from '@/ai/flows/extract-keywords-flow';

describe('extractKeywordsFlow', () => {

  let flowSpy: any;

  beforeEach(() => {
    // We spy on the internal flow function to isolate our wrapper function's logic.
    flowSpy = vi.spyOn(aiFlow, 'extractKeywordsFlow').mockResolvedValue({
        keywords: ['test', 'gratitude', 'journey']
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return an empty array if the input text is empty or just whitespace', async () => {
    const input: ExtractKeywordsInput = { text: '   ' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);
    
    expect(result.keywords).toEqual([]);
    // The actual flow should not have been called due to the early return logic in the wrapper.
    expect(flowSpy).not.toHaveBeenCalled();
  });

  it('should call the AI flow and return keywords for valid text', async () => {
    const input: ExtractKeywordsInput = { text: 'This is a test of gratitude on my journey.' };
    const result: ExtractKeywordsOutput = await extractKeywords(input);

    // The flow function should be called with the correct input
    expect(flowSpy).toHaveBeenCalledWith(input);
    // The result should be the mocked output
    expect(result.keywords).toEqual(['test', 'gratitude', 'journey']);
  });
});
