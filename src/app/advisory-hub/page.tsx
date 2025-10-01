'use client';
import { advisoryArticles, advisoryCategories } from '@/lib/advisory-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AdvisoryClient } from './components/advisory-client';
import { useTranslation } from '@/context/language-context';
import { useMemo, useEffect, useState } from 'react';
import { DailyBriefingClient } from './components/daily-briefing-client';

// Simple pseudo-random number generator for deterministic shuffling
function prng(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Function to shuffle an array deterministically based on a seed
function shuffle<T>(array: T[], seed: number): T[] {
  const random = prng(seed);
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
}


export default function AdvisoryHubPage() {
  const { t } = useTranslation();
  
  const [shuffledArticles, setShuffledArticles] = useState([...advisoryArticles]);

  useEffect(() => {
    // Use the current date as a seed for daily shuffling
    const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate();
    setShuffledArticles(shuffle([...advisoryArticles], seed));
  }, []);

  const articlesWithImages = useMemo(() => {
    return shuffledArticles.map((article) => {
      const image = PlaceHolderImages.find((img) => img.id === article.imageId);
      return {
        ...article,
        title: t(`advisory.articles.${article.id}.title`),
        summary: t(`advisory.articles.${article.id}.summary`),
        category: t(`advisory.categories.${article.category.replace(' ', '')}`),
        imageUrl: image?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400',
        imageHint: image?.imageHint || 'farming',
      };
    });
  }, [shuffledArticles, t]);
  
  const translatedCategories = advisoryCategories.map(cat => t(`advisory.categories.${cat.replace(' ', '')}`));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{t('advisory.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('advisory.description')}
        </p>
      </div>

      <DailyBriefingClient />

      <AdvisoryClient articles={articlesWithImages} categories={translatedCategories} />
    </div>
  );
}
