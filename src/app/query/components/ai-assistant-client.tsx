'use client';

import { aiQuerySupport } from '@/ai/flows/ai-query-support';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Languages, Send, User } from 'lucide-react';
import { useState, useTransition, useRef, useEffect } from 'react';
import { useLanguage, useTranslation, languages } from '@/context/language-context';


type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAssistantClient() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const languageLabel = languages.find(l => l.value === language)?.label || 'English';
        const result = await aiQuerySupport({ query: input, language: languageLabel });
        if (result && result.advice) {
          const assistantMessage: Message = { role: 'assistant', content: result.advice };
          setConversation((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error('Invalid response from AI');
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: t('aiAssistant.errorTitle'),
          description: t('aiAssistant.errorDescription'),
        });
        setConversation((prev) => prev.slice(0, -1)); // Remove the user's message on error
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('aiAssistant.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chatContainerRef} className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-md bg-background">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="w-12 h-12 mb-4" />
              <p>{t('aiAssistant.prompt')}</p>
              <p className="text-sm">{t('aiAssistant.promptExample')}</p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  'max-w-xs md:max-w-md p-3 rounded-lg',
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isPending && (
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('aiAssistant.inputPlaceholder').replace('{language}', languages.find(l => l.value === language)?.label || 'English')}
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !input.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">{t('aiAssistant.send')}</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
