'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BotMessageSquare, Image } from 'lucide-react';
import { AiAssistantClient } from './components/ai-assistant-client';
import { ImageAnalysisClient } from './components/image-analysis-client';
import { useTranslation } from '@/context/language-context';

export default function QueryPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('query.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('query.description')}
        </p>
      </div>

      <Tabs defaultValue="assistant" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant">
            <BotMessageSquare className="mr-2 h-5 w-5" />
            {t('query.aiAssistantTab')}
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Image className="mr-2 h-5 w-5" />
            {t('query.imageAnalysisTab')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assistant" className="mt-6">
          <AiAssistantClient />
        </TabsContent>
        <TabsContent value="analysis" className="mt-6">
          <ImageAnalysisClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
