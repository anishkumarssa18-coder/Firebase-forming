'use client';
import { advisoryArticles, advisoryCategories } from '@/lib/advisory-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AdvisoryClient } from './components/advisory-client';
import { useTranslation } from '@/context/language-context';

export default function AdvisoryHubPage() {
  const { t } = useTranslation();
  const articlesWithImages = advisoryArticles.map((article) => {
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
