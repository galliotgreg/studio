
'use server';
/**
 * @fileOverview AI-powered keyword extraction from gratitude entries.
 *
 * - extractKeywords - A function that extracts meaningful keywords (nouns, adjectives, verbs) from a block of text.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeywordsInputSchema = z.object({
  text: z
    .string()
    .describe('A block of text containing gratitude journal entries.'),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe(
      'A list of the most significant and frequent nouns, adjectives, and verbs related to gratitude.'
    ),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

export async function extractKeywords(
  input: ExtractKeywordsInput
): Promise<ExtractKeywordsOutput> {
  return extractKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: {schema: ExtractKeywordsInputSchema},
  output: {schema: ExtractKeywordsOutputSchema},
  prompt: `You are a text analysis expert. Your task is to extract the most meaningful and frequent keywords from the following journal entries.

Focus on nouns, adjectives, and verbs that reveal themes of gratitude.
- Combine plural and singular forms (e.g., "friend" and "friends" should be treated as one).
- Return a list of unique keywords.
- Ignore common filler words.

Text to analyze:
{{{text}}}
`,
});

const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async input => {
    if (!input.text.trim()) {
        return { keywords: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
