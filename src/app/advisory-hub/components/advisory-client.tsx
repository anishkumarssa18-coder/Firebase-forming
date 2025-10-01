'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Filter, Search } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { AdvisoryArticle } from '@/lib/advisory-data';
import { useTranslation } from '@/context/language-context';
import Link from 'next/link';

type AdvisoryArticleWithImage = Omit<AdvisoryArticle, 'category'> & {
  imageUrl: string;
  imageHint: string;
  category: string;
};

interface AdvisoryClientProps {
  articles: AdvisoryArticleWithImage[];
  categories: string[];
}

export function AdvisoryClient({ articles, categories }: AdvisoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation();

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
      const matchesSearch = searchTerm
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('advisory.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
                variant={selectedCategory === null ? 'default' : 'secondary'}
                onClick={() => setSelectedCategory(null)}
                className="flex-shrink-0"
            >
                <Filter className="mr-2 h-4 w-4" /> {t('advisory.all')}
            </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
                <div className="relative w-full h-48">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-opacity opacity-0 duration-1000"
                    onLoad={event => event.currentTarget.classList.remove('opacity-0')}
                    data-ai-hint={article.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{article.summary}</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold bg-primary/20 text-primary-foreground rounded-full px-3 py-1">{article.category}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">{t('advisory.noArticlesFound')}</p>
          <p className="text-sm text-muted-foreground">{t('advisory.adjustFilters')}</p>
        </div>
      )}
    </div>
  );
}
