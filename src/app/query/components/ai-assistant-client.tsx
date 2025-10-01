'use client';

import { aiQuerySupport } from '@/ai/flows/ai-query-support';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Mic, MicOff, Send, User, Volume2, Loader2 } from 'lucide-react';
import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { useLanguage, useTranslation, languages } from '@/context/language-context';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
};

type VoiceOption = 'male' | 'female';
const voices: Record<VoiceOption, string> = {
  female: 'Achernar',
  male: 'Algenib',
};

export function AiAssistantClient() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isRecording, setIsRecording] = useState(false);
  const [isUttering, setIsUttering] = useState(false);
  const [isTtsPending, setIsTtsPending] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('female');
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechRecognitionSupported(!!SpeechRecognition);
  }, []);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleTextToSpeech = useCallback(async (text: string, messageIndex: number) => {
    setIsTtsPending(true);
    try {
      const result = await textToSpeech({ text, voice: voices[selectedVoice] });
      if (result && result.audioDataUri) {
        setConversation(prev => {
            const newConversation = [...prev];
            if(newConversation[messageIndex]) {
                newConversation[messageIndex].audioUrl = result.audioDataUri;
            }
            return newConversation;
        });
        playAudio(result.audioDataUri);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Failed to generate audio for the response.',
      });
    } finally {
        setIsTtsPending(false);
    }
  }, [toast, selectedVoice]);

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    setIsUttering(true);
    audio.onended = () => setIsUttering(false);
    audio.play();
  };

  const handleSubmit = useCallback(async (text: string) => {
    if (!text.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: text };
    setConversation((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const languageLabel = languages.find(l => l.value === language)?.label || 'English';
        const result = await aiQuerySupport({ query: text, language: languageLabel });
        if (result && result.advice) {
          const assistantMessage: Message = { role: 'assistant', content: result.advice };
          const newConversationLength = conversation.length + 2; // user's + assistant's
          setConversation((prev) => [...prev, assistantMessage]);
          handleTextToSpeech(result.advice, newConversationLength - 1);
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
  }, [isPending, language, t, toast, conversation.length, handleTextToSpeech]);


  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
        setInput('Listening...');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (input.trim() === 'Listening...' || input.trim() === '') {
            setInput('');
        } else {
           handleSubmit(input);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Error',
          description: `An error occurred: ${event.error}`,
        });
        setIsRecording(false);
        setInput('');
      };

      recognition.start();
    }
  };
  
  const toggleVoice = () => {
    setSelectedVoice(prev => prev === 'female' ? 'male' : 'female');
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('aiAssistant.title')}</span>
           <Button variant="outline" size="icon" onClick={toggleVoice}>
              {selectedVoice === 'female' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              <span className="sr-only">Switch Voice</span>
          </Button>
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
                  'max-w-xs md:max-w-md p-3 rounded-lg flex items-center gap-2',
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && msg.audioUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => playAudio(msg.audioUrl!)}
                      disabled={isUttering || isTtsPending}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                   {msg.role === 'assistant' && !msg.audioUrl && isTtsPending && index === conversation.length -1 && (
                     <Loader2 className="h-4 w-4 animate-spin"/>
                  )}
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
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} className="flex w-full items-center gap-2">
           <Button type="button" variant="outline" onClick={toggleRecording} disabled={!isSpeechRecognitionSupported || isPending}>
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('aiAssistant.inputPlaceholder').replace('{language}', languages.find(l => l.value === language)?.label || 'English')}
            disabled={isPending || isRecording}
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
