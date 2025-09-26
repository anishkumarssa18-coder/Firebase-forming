'use client';

import { imageBasedDiseaseDiagnosis } from '@/ai/flows/image-based-disease-diagnosis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Microscope, Loader2, Camera, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '@/context/language-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ImageAnalysisClient() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  const getCameraPermission = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
      setCameraOpen(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isCameraOpen) {
      getCameraPermission();
    } else {
      // Stop camera stream when dialog is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOpen, getCameraPermission]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: t('imageAnalysis.fileTooLargeTitle'),
          description: t('imageAnalysis.fileTooLargeDescription'),
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

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        setFile(dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`));
        setCameraOpen(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: t('imageAnalysis.noImageSelectedTitle'),
        description: t('imageAnalysis.noImageSelectedDescription'),
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
          title: t('imageAnalysis.analysisFailedTitle'),
          description: t('imageAnalysis.analysisFailedDescription'),
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('imageAnalysis.title')}</CardTitle>
        <CardDescription>{t('imageAnalysis.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
          {!preview ? (
            <>
              <div className="flex items-center justify-center space-x-4">
                 <Upload className="w-12 h-12 text-muted-foreground" />
                 <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mt-4">{t('imageAnalysis.uploadTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('imageAnalysis.uploadDescription')}</p>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                id="image-upload"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button asChild>
                  <label htmlFor="image-upload">{t('imageAnalysis.browseFiles')}</label>
                </Button>
                <Dialog open={isCameraOpen} onOpenChange={setCameraOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Camera className="mr-2"/> Use Camera
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Capture Image</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                            <canvas ref={canvasRef} className="hidden" />
                            {hasCameraPermission === false && (
                                <Alert variant="destructive">
                                  <AlertTitle>Camera Access Denied</AlertTitle>
                                  <AlertDescription>
                                    Please enable camera permissions in your browser settings to use this feature.
                                  </AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <DialogFooter className="gap-2 sm:justify-center">
                           <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
                              <Camera className="mr-2"/> Capture
                           </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>
            </>
          ) : (
            <div className="relative w-full max-w-sm">
              <Image src={preview} alt={t('imageAnalysis.imagePreviewAlt')} width={400} height={300} className="rounded-md object-contain" />
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
              {isPending ? t('imageAnalysis.analyzing') : t('imageAnalysis.diagnoseButton')}
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
              <CardTitle className="flex items-center gap-2"><Microscope className="h-5 w-5 text-primary" /> {t('imageAnalysis.diagnosisResultTitle')}</CardTitle>
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
