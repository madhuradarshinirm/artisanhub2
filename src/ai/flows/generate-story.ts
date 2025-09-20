
'use server';
/**
 * @fileOverview Generates a product story using AI.
 *
 * - generateStory - A function that creates a story for a product.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateStoryInputSchema = z.object({
  productInfo: z.string().describe('The name and description of the product.'),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story for the product.'),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: { schema: GenerateStoryInputSchema },
  output: { schema: GenerateStoryOutputSchema },
  prompt: `You are a master storyteller for an artisan marketplace. Your task is to write a short, compelling, and slightly whimsical story for a product.

  The story should evoke a sense of craft, quality, and uniqueness. It should be about 2-3 paragraphs long.

  Product Information:
  {{{productInfo}}}
  
  Generate a story based on this information.
`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
