'use server';

/**
 * @fileOverview Provides AI-powered query support for farmers, allowing them to ask questions
 * about various agricultural topics and receive instant advisory support in multiple languages.
 *
 * @module ai/flows/ai-query-support
 *
 * @interface AIQuerySupportInput - Defines the input for the AI query support flow, including the query and language.
 *
 * @interface AIQuerySupportOutput - Defines the output of the AI query support flow, providing the AI's advisory response.
 *
 * @function aiQuerySupport - The main function to handle farmer queries and provide AI-driven support.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIQuerySupportInputSchema = z.object({
  query: z.string().describe('The farmer’s question about crops, pests, fertilizers, irrigation, or government schemes.'),
  language: z.string().describe('The language in which the question is asked (e.g., English, Hindi).'),
});
export type AIQuerySupportInput = z.infer<typeof AIQuerySupportInputSchema>;

const AIQuerySupportOutputSchema = z.object({
  advice: z.string().describe('The AI’s advisory response to the farmer’s question, provided in simple language.'),
});
export type AIQuerySupportOutput = z.infer<typeof AIQuerySupportOutputSchema>;

export async function aiQuerySupport(input: AIQuerySupportInput): Promise<AIQuerySupportOutput> {
  return aiQuerySupportFlow(input);
}

const aiQuerySupportPrompt = ai.definePrompt({
  name: 'aiQuerySupportPrompt',
  input: {schema: AIQuerySupportInputSchema},
  output: {schema: AIQuerySupportOutputSchema},
  prompt: `You are an AI assistant providing agricultural advice to farmers.

The farmer will ask a question in their local language, and you will provide an answer in the same language.

Question: {{{query}}}
Language: {{{language}}}

Provide clear, concise, and actionable advice in simple language that is easy for farmers to understand.
`,
});

const aiQuerySupportFlow = ai.defineFlow(
  {
    name: 'aiQuerySupportFlow',
    inputSchema: AIQuerySupportInputSchema,
    outputSchema: AIQuerySupportOutputSchema,
  },
  async input => {
    const {output} = await aiQuerySupportPrompt(input);
    return output!;
  }
);
