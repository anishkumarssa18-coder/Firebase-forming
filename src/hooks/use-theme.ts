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

  const setThemeAndMode = (newTheme: string) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
       setTheme(newTheme);
       return;
    }

    const currentMode = resolvedTheme;
    const themeToSet = currentMode === 'dark' ? `dark-${newTheme}`: newTheme;
    setTheme(themeToSet);
  }

  return {
    themes: THEMES,
    theme: theme,
    setTheme: setThemeAndMode,
    mode: resolvedTheme, // 'light', 'dark', or 'system'
    resolvedMode: resolvedTheme, // 'light' or 'dark'
  };
}
