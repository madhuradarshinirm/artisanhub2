
'use server';
/**
 * @fileOverview Customizes a product image background using AI.
 *
 * - customizeImage - A function that changes the background of an image.
 * - CustomizeImageInput - The input type for the customizeImage function.
 * - CustomizeImageOutput - The return type for the customizeImage function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CustomizeImageInputSchema = z.object({
  image: z.object({
    url: z
      .string()
      .describe(
        "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  }),
  prompt: z
    .string()
    .describe('A description of the desired new background for the product image.'),
});
export type CustomizeImageInput = z.infer<typeof CustomizeImageInputSchema>;

const CustomizeImageOutputSchema = z.object({
  image: z
    .object({
      url: z.string().optional(),
    })
    .optional(),
});
export type CustomizeImageOutput = z.infer<typeof CustomizeImageOutputSchema>;

export async function customizeImage(
  input: CustomizeImageInput
): Promise<CustomizeImageOutput> {
  return customizeImageFlow(input);
}

const customizeImageFlow = ai.defineFlow(
  {
    name: 'customizeImageFlow',
    inputSchema: CustomizeImageInputSchema,
    outputSchema: CustomizeImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.image.url } },
        { text: `Given the product image, keep the product as the subject and replace the background with the following description: "${input.prompt}". The final image should be photorealistic.` },
      ],
      config: {
        responseModalities: ['IMAGE'],
      },
    });
    return { image: { url: media.url } };
  }
);
