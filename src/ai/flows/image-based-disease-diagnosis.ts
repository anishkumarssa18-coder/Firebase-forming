'use server';
/**
 * @fileOverview An AI agent that diagnoses crop diseases based on images.
 *
 * - imageBasedDiseaseDiagnosis - A function that handles the image-based disease diagnosis process.
 * - ImageBasedDiseaseDiagnosisInput - The input type for the imageBasedDiseaseDiagnosis function.
 * - ImageBasedDiseaseDiagnosisOutput - The return type for the imageBasedDiseaseDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedDiseaseDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, soil, or potential disease, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageBasedDiseaseDiagnosisInput = z.infer<typeof ImageBasedDiseaseDiagnosisInputSchema>;

const ImageBasedDiseaseDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the image, including potential diseases, pests, and solutions.'),
});
export type ImageBasedDiseaseDiagnosisOutput = z.infer<typeof ImageBasedDiseaseDiagnosisOutputSchema>;

export async function imageBasedDiseaseDiagnosis(input: ImageBasedDiseaseDiagnosisInput): Promise<ImageBasedDiseaseDiagnosisOutput> {
  return imageBasedDiseaseDiagnosisFlow(input);
}

const imageBasedDiseaseDiagnosisPrompt = ai.definePrompt({
  name: 'imageBasedDiseaseDiagnosisPrompt',
  input: {schema: ImageBasedDiseaseDiagnosisInputSchema},
  output: {schema: ImageBasedDiseaseDiagnosisOutputSchema},
  prompt: `You are an expert in diagnosing plant diseases and pests based on images.

  Analyze the image and provide a diagnosis, including potential diseases, pests, and solutions for a farmer.

  Here is the image to analyze: {{media url=photoDataUri}}`,
});

const imageBasedDiseaseDiagnosisFlow = ai.defineFlow(
  {
    name: 'imageBasedDiseaseDiagnosisFlow',
    inputSchema: ImageBasedDiseaseDiagnosisInputSchema,
    outputSchema: ImageBasedDiseaseDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await imageBasedDiseaseDiagnosisPrompt(input);
    return output!;
  }
);
