'use client';
import { advisoryArticles, advisoryCategories } from '@/lib/advisory-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AdvisoryClient } from './components/advisory-client';
import { useTranslation } from '@/context/language-context';
import { useMemo, useEffect, useState } from 'react';

// Function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export default function AdvisoryHubPage() {
  const { t } = useTranslation();
  
  const [shuffledArticles, setShuffledArticles] = useState([...advisoryArticles]);

  useEffect(() => {
    setShuffledArticles(shuffle([...advisoryArticles]));
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
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('advisory.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('advisory.description')}
        </p>
      </div>
      <AdvisoryClient articles={articlesWithImages} categories={translatedCategories} />
    </div>
  );
}
