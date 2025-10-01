'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().optional().describe('The voice to use for the speech (e.g., Algenib, Achernar). Defaults to Achernar.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .optional()
    .describe(
      "The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'"
    ),
  error: z.string().optional().describe('An error message if TTS fails.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voice }) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
        },
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Achernar' },
            },
        },
        prompt: text,
      });

      if (!media?.url) {
        throw new Error('No media returned from TTS model');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);

      return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
      };
    } catch (err: any) {
      console.error("Text-to-speech flow failed", err);
      if (err.stack?.includes('[429') || err.message?.includes('429')) {
          return { error: 'Text-to-speech quota exceeded. Please try again later.' };
      }
      return { error: 'Failed to generate audio.' };
    }
  }
);
