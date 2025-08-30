'use server';

/**
 * @fileOverview A translation AI agent that translates and restates.
 *
 * - translateAndRestate - A function that handles the translation and restatement process.
 * - TranslateAndRestateInput - The input type for the translateAndRestate function.
 * - TranslateAndRestateOutput - The return type for the translateAndRestate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndRestateInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
});
export type TranslateAndRestateInput = z.infer<typeof TranslateAndRestateInputSchema>;

const TranslateAndRestateOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
  restatementSuggestion: z.string().optional().describe('A suggestion for restating the text if it is ambiguous.'),
});
export type TranslateAndRestateOutput = z.infer<typeof TranslateAndRestateOutputSchema>;

export async function translateAndRestate(input: TranslateAndRestateInput): Promise<TranslateAndRestateOutput> {
  return translateAndRestateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateAndRestatePrompt',
  input: {schema: TranslateAndRestateInputSchema},
  output: {schema: TranslateAndRestateOutputSchema},
  prompt: `You are a translation AI that translates text from any language to {{targetLanguage}}. You also provide suggestions for restating the text if it is ambiguous.

  Text: {{{text}}}

  If the text is ambiguous, provide a suggestion for restating the text in the restatementSuggestion field. Otherwise, leave it blank.
`,
});

const translateAndRestateFlow = ai.defineFlow(
  {
    name: 'translateAndRestateFlow',
    inputSchema: TranslateAndRestateInputSchema,
    outputSchema: TranslateAndRestateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
