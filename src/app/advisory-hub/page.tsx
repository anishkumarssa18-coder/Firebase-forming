import { advisoryArticles, advisoryCategories } from '@/lib/advisory-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AdvisoryClient } from './components/advisory-client';

export default function AdvisoryHubPage() {
  const articlesWithImages = advisoryArticles.map((article) => {
    const image = PlaceHolderImages.find((img) => img.id === article.imageId);
    return {
      ...article,
      imageUrl: image?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400',
      imageHint: image?.imageHint || 'farming',
    };
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Advisory Knowledge Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your one-stop resource for farming knowledge and best practices.
        </p>
      </div>
      <AdvisoryClient articles={articlesWithImages} categories={advisoryCategories} />
    </div>
  );
}
