'use client';

import { dailyBriefing } from '@/ai/flows/daily-briefing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { AlertTriangle, Loader2, Newspaper } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export function DailyBriefingClient() {
  const { language } = useLanguage();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await dailyBriefing({ language: language });
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
          <span>Daily Farmer's Briefing</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating today's briefing...</span>
          </div>
        )}
        {error && !isPending && (
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {briefing && !isPending && (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {briefing}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
