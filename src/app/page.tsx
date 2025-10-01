'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRealTimeWeather, type CurrentWeather, type ForecastDay } from '@/lib/weather-data';
import { ArrowRight, Cloud, Droplets, Sun, Thermometer, Wind, CloudRain, LocateFixed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

const defaultWeather: {
  currentWeather: CurrentWeather,
  forecast: ForecastDay[]
} = {
  currentWeather: {
    location: 'Loading...',
    temperature: 0,
    condition: '...',
    description: '...',
    wind: '... km/h',
    humidity: '...%',
    windSpeed: 0,
  },
  forecast: []
};

export default function Home() {
  const [weather, setWeather] = useState(defaultWeather);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const hasAlertedRef = useRef(false);

  const [windThreshold, setWindThreshold] = useState(30);
  const [heatThreshold, setHeatThreshold] = useState(35);
  const [coldThreshold, setColdThreshold] = useState(5);

  useEffect(() => {
    try {
        const savedWind = localStorage.getItem('windThreshold');
        const savedHeat = localStorage.getItem('heatThreshold');
        const savedCold = localStorage.getItem('coldThreshold');

        if (savedWind) setWindThreshold(JSON.parse(savedWind));
        if (savedHeat) setHeatThreshold(JSON.parse(savedHeat));
        if (savedCold) setColdThreshold(JSON.parse(savedCold));
    } catch (error) {
        console.error("Failed to load weather thresholds from localStorage", error);
    }
  }, []);

  const fetchWeatherForLocation = useCallback(async (lat: number, lon: number) => {
    setError(null);
    setLoading(true);
    hasAlertedRef.current = false;
    try {
      const weatherData = await getRealTimeWeather(lat, lon);
      setWeather(weatherData);
    } catch (err) {
      setError(t('home.weatherError'));
      setWeather(defaultWeather); // Reset to default on error
    } finally {
      setLoading(false);
    }
  }, [t]);

  const requestLocationAndUpdateWeather = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherForLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          toast({
            variant: 'default',
            title: t('home.locationDeniedTitle'),
            description: t('home.locationDeniedDescription')
          });
          // On denial, explicitly fetch for default location: Nagapattinam
          fetchWeatherForLocation(10.77, 79.84);
        }
      );
    } else {
       toast({
          variant: 'default',
          title: t('home.geolocationNotSupportedTitle'),
          description: t('home.geolocationNotSupportedDescription')
        });
        // Geolocation not supported, fetch for default location: Nagapattinam
        fetchWeatherForLocation(10.77, 79.84);
    }
  }, [fetchWeatherForLocation, t, toast]);

  useEffect(() => {
    requestLocationAndUpdateWeather();
  }, [requestLocationAndUpdateWeather]);

  useEffect(() => {
    // This effect runs only when weather data is loaded and no alerts have been shown for this data yet.
    if (!loading && weather.currentWeather.location !== 'Loading...' && !hasAlertedRef.current) {
        const { windSpeed, temperature, description } = weather.currentWeather;

        if (windSpeed > windThreshold) {
            toast({
                variant: 'destructive',
                title: t('home.alerts.highWind.title'),
                description: t('home.alerts.highWind.description', { wind: weather.currentWeather.wind }),
                duration: 8000,
            });
        }

        if (temperature > heatThreshold) {
            toast({
                variant: 'destructive',
                title: t('home.alerts.heatwave.title'),
                description: t('home.alerts.heatwave.description', { temp: temperature }),
                duration: 8000,
            });
        }

        if (temperature < coldThreshold) {
            toast({
                variant: 'destructive',
                title: t('home.alerts.coldSnap.title'),
                description: t('home.alerts.coldSnap.description', { temp: temperature }),
                duration: 8_000,
            });
        }
        
        const lowerCaseDescription = description.toLowerCase();
        if (lowerCaseDescription.includes('heavy rain') || lowerCaseDescription.includes('thunderstorm')) {
            toast({
                variant: 'destructive',
                title: t('home.alerts.heavyRain.title'),
                description: t('home.alerts.heavyRain.description'),
                duration: 8000,
            });
        }
        
        // Mark that alerts have been processed for this weather data load.
        hasAlertedRef.current = true;
    }
  }, [weather.currentWeather, loading, toast, t, windThreshold, heatThreshold, coldThreshold]);
  
  const { currentWeather, forecast } = weather;

  const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
    const lowerCaseCondition = condition?.toLowerCase() || '';
    if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
      return <Sun className={className} />;
    }
    if (lowerCaseCondition.includes('cloud')) {
      return <Cloud className={className} />;
    }
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
      return <CloudRain className={className} />;
    }
    return <Cloud className={className} />;
  };

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          {t('home.welcome')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('home.tagline')}
        </p>
        
        <Card className="max-w-md mx-auto shadow-lg border-2 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary">
              <span>{currentWeather.location}</span>
              <Button variant="ghost" size="icon" onClick={requestLocationAndUpdateWeather} disabled={loading} className="w-8 h-8">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
                  <span className="sr-only">{t('home.refreshLocation')}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading ? (
                <div className="flex flex-col items-center justify-center h-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">{t('home.loadingWeather')}</p>
                </div>
            ) : error ? (
                <div className="text-center text-destructive">{error}</div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Thermometer className="w-6 h-6 text-primary" />
                          <span className="text-4xl font-bold">{currentWeather.temperature}°C</span>
                      </div>
                      <div className='flex flex-col items-center'>
                          <WeatherIcon condition={currentWeather.description} className="w-8 h-8 text-yellow-500" />
                          <p className="text-lg text-muted-foreground capitalize">{currentWeather.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-muted-foreground" /> {t('home.wind')}: {currentWeather.wind}</div>
                      <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-muted-foreground" /> {t('home.humidity')}: {currentWeather.humidity}</div>
                    </div>
                </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-center text-primary">
          {t('home.forecastTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {loading ? (
             Array(7).fill(0).map((_, index) => (
                <Card key={index} className="flex flex-col items-center p-4 shadow-md">
                   <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                   </div>
                </Card>
              ))
          ) : (
            forecast.map((day, index) => (
              <Card key={index} className="flex flex-col items-center p-4 shadow-md transition-transform hover:scale-105 hover:shadow-xl">
                  <p className="font-bold">{day.day}</p>
                  <div className="my-2">
                      <WeatherIcon condition={day.condition} className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-semibold">{day.temp}°C</p>
              </Card>
            ))
          )}
        </div>
      </section>
      
      <section className="text-center py-8">
        <Card className="bg-primary/10 border-primary/20 max-w-4xl mx-auto p-8">
          <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary">
            {t('home.haveQuestion')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('home.askAi')}
          </p>
          <Button asChild size="lg" className="mt-6 animate-pulse">
            <Link href="/query">
              {t('home.askAiButton')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
