'use client';

import { imageBasedDiseaseDiagnosis } from '@/ai/flows/image-based-disease-diagnosis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Microscope, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition, useRef } from 'react';

export function ImageAnalysisClient() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setDiagnosis(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    setDiagnosis(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please upload an image to analyze.',
      });
      return;
    }

    setDiagnosis(null);

    startTransition(async () => {
      try {
        const result = await imageBasedDiseaseDiagnosis({ photoDataUri: preview });
        if (result && result.diagnosis) {
          setDiagnosis(result.diagnosis);
        } else {
          throw new Error('Invalid response from AI');
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Could not get a diagnosis. Please try again.',
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Crop & Soil Image Analysis</CardTitle>
        <CardDescription>Upload an image of a plant, leaf, or soil to get an AI-powered diagnosis and suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
          {!preview ? (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Upload an Image</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to select a file</p>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                id="image-upload"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
              <Button asChild className="mt-4">
                <label htmlFor="image-upload">Browse Files</label>
              </Button>
            </>
          ) : (
            <div className="relative w-full max-w-sm">
              <Image src={preview} alt="Image preview" width={400} height={300} className="rounded-md object-contain" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleRemoveImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {preview && (
          <div className="flex justify-center">
            <Button onClick={handleSubmit} disabled={isPending} size="lg">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Microscope className="mr-2 h-5 w-5" />}
              {isPending ? 'Analyzing...' : 'Diagnose Image'}
            </Button>
          </div>
        )}
        
        {isPending && (
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-muted rounded-full w-1/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse"></div>
          </div>
        )}
        
        {diagnosis && (
          <Card className="bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Microscope className="h-5 w-5 text-primary" /> AI Diagnosis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{diagnosis}</p>
            </CardContent>
          </Card>
        )}

      </CardContent>
    </Card>
  );
}
