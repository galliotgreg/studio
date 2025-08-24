'use server';
/**
 * @fileOverview AI-powered gratitude prompt suggestion flow.
 *
 * - suggestGratitudePrompt - A function that suggests a personalized gratitude prompt based on past responses.
 * - SuggestGratitudePromptInput - The input type for the suggestGratitudePrompt function.
 * - SuggestGratitudePromptOutput - The return type for the suggestGratitudePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGratitudePromptInputSchema = z.object({
  pastResponses: z
    .string()
    .describe(
      'A string containing the user\'s past gratitude responses, separated by newlines.'
    ),
});
export type SuggestGratitudePromptInput = z.infer<
  typeof SuggestGratitudePromptInputSchema
>;

const SuggestGratitudePromptOutputSchema = z.object({
  suggestedPrompt: z
    .string()
    .describe('A personalized gratitude prompt based on past responses.'),
});
export type SuggestGratitudePromptOutput = z.infer<
  typeof SuggestGratitudePromptOutputSchema
>;

export async function suggestGratitudePrompt(
  input: SuggestGratitudePromptInput
): Promise<SuggestGratitudePromptOutput> {
  return suggestGratitudePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGratitudePrompt',
  input: {schema: SuggestGratitudePromptInputSchema},
  output: {schema: SuggestGratitudePromptOutputSchema},
  prompt: `You are a gratitude prompt generator. You will generate a personalized gratitude prompt based on the user's past responses.

Past Responses:
{{{pastResponses}}}

Suggested Prompt: `,
});

const suggestGratitudePromptFlow = ai.defineFlow(
  {
    name: 'suggestGratitudePromptFlow',
    inputSchema: SuggestGratitudePromptInputSchema,
    outputSchema: SuggestGratitudePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
