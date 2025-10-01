'use client';

import { useTheme as useNextTheme } from 'next-themes';

const THEMES = [
  'default',
  'forest',
  'sky',
  'rose',
  'ocean',
  'sunset',
  'lavender',
  'sunflower',
  'cosmic',
];

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  return {
    themes: THEMES,
    theme: theme,
    setTheme: setTheme,
    mode: theme, 
    resolvedMode: resolvedTheme,
  };
}
