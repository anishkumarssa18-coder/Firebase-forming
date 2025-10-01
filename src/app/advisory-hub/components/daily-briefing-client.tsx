'use client';

import { dailyBriefing } from '@/ai/flows/daily-briefing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, useTranslation } from '@/context/language-context';
import { AlertTriangle, Loader2, Newspaper } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export function DailyBriefingClient() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      setError(null);
      setBriefing(null);
      startTransition(async () => {
        try {
          const languageLabel =
            {
              en: 'English',
              hi: 'Hindi',
              mr: 'Marathi',
              bn: 'Bengali',
              te: 'Telugu',
              ta: 'Tamil',
            }[language] || 'English';

          const result = await dailyBriefing({
            language: languageLabel,
            currentDate: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
          });
          setBriefing(result.briefing);
        } catch (err) {
          console.error('Failed to fetch daily briefing:', err);
          setError('Could not load the daily briefing. Please try again later.');
        }
      });
    };
    fetchBriefing();
  }, [language]);

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary">
          <Newspaper className="h-6 w-6" />
          <span>{t('advisory.dailyBriefingTitle')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t('advisory.generatingBriefing')}</span>
          </div>
        )}
        {error && !isPending && (
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {briefing && !isPending && (
          <div className="whitespace-pre-wrap text-sm text-foreground">
            {briefing}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
