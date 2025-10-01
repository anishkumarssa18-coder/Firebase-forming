'use server';

/**
 * @fileOverview Generates a daily farming briefing using AI.
 *
 * This flow produces a concise, timely summary of agricultural news,
 * market trends, pest alerts, or scheme updates for the day.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DailyBriefingInputSchema = z.object({
  language: z.string().describe('The language code for the briefing (e.g., en, hi).'),
});
export type DailyBriefingInput = z.infer<typeof DailyBriefingInputSchema>;

const DailyBriefingOutputSchema = z.object({
  briefing: z.string().describe('A concise daily briefing for farmers, including tips, news, and alerts.'),
});
export type DailyBriefingOutput = z.infer<typeof DailyBriefingOutputSchema>;

export async function dailyBriefing(input: DailyBriefingInput): Promise<DailyBriefingOutput> {
  return dailyBriefingFlow(input);
}

const dailyBriefingPrompt = ai.definePrompt({
  name: 'dailyBriefingPrompt',
  input: { schema: DailyBriefingInputSchema },
  output: { schema: DailyBriefingOutputSchema },
  prompt: `You are an agricultural expert AI. Generate a short, scannable "Daily Farmer's Briefing" for today, {{currentDate}}.

The briefing should be in the language corresponding to this language code: {{{language}}}.

Include 3-4 bullet points covering a mix of the following topics:
- A critical, timely farming tip (e.g., related to current season, weather).
- A brief update on a relevant government scheme for farmers.
- A summary of a recent development in agricultural technology or market trends.
- An alert for potential pest or disease outbreaks based on common seasonal patterns.

The tone should be informative, direct, and easy to understand. Start with a positive and encouraging opening.

IMPORTANT: Format the bullet points using plain text, like '*' or '-', not with HTML tags like <ul> or <li>.
`,
});

const dailyBriefingFlow = ai.defineFlow(
  {
    name: 'dailyBriefingFlow',
    inputSchema: DailyBriefingInputSchema,
    outputSchema: DailyBriefingOutputSchema,
  },
  async (input) => {
    const { output } = await dailyBriefingPrompt({
      ...input,
      currentDate: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
    });
    return output!;
  }
);
