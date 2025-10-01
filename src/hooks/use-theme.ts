'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const THEMES = [
  { name: 'default', class: 'theme-default' },
  { name: 'forest', class: 'theme-forest' },
  { name: 'sky', class: 'theme-sky' },
  { name: 'rose', class: 'theme-rose' },
  { name: 'ocean', class: 'theme-ocean' },
  { name: 'sunset', class: 'theme-sunset' },
  { name: 'lavender', class: 'theme-lavender' },
  { name: 'sunflower', class: 'theme-sunflower' },
  { name: 'cosmic', class: 'theme-cosmic' },
];

export function useTheme() {
  const { theme: mode, setTheme: setMode, resolvedTheme } = useNextTheme();
  const [theme, setThemeState] = useState('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('theme') || 'default';
    setThemeState(storedTheme);
    const currentTheme = THEMES.find(t => t.name === storedTheme);
    if (currentTheme) {
      // Remove other theme classes
      for (const t of THEMES) {
        document.documentElement.classList.remove(t.class);
      }
      document.documentElement.classList.add(currentTheme.class);
    }
  }, []);

  const setTheme = (themeName: string) => {
    const newTheme = THEMES.find(t => t.name === themeName);
    if (newTheme) {
      // Remove all other theme classes before adding the new one
      for (const t of THEMES) {
        document.documentElement.classList.remove(t.class);
      }
      document.documentElement.classList.add(newTheme.class);
      
      localStorage.setItem('theme', themeName);
      setThemeState(themeName);
    }
  };

  return {
    themes: THEMES,
    theme,
    setTheme,
    mode, // 'light', 'dark', or 'system'
    setMode, // function to change mode
    resolvedMode: resolvedTheme, // 'light' or 'dark'
    isMounted,
  };
}
