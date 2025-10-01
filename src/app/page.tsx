'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRealTimeWeather, type CurrentWeather, type ForecastDay } from '@/lib/weather-data';
import { ArrowRight, Cloud, Droplets, Sun, Thermometer, Wind, CloudRain, LocateFixed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
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
    wind: '... km/h',
    humidity: '...%',
    windSpeed: 0,
  },
  forecast: Array(7).fill({ day: '...', temp: 0, condition: 'Cloudy' })
};

export default function Home() {
  const [weather, setWeather] = useState(defaultWeather);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();

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

  const fetchWeatherForLocation = useCallback(async (lat: number, lon: number, fallbackCityName?: string) => {
    setError(null);
    setLoading(true);
    try {
      const weatherData = await getRealTimeWeather(lat, lon, fallbackCityName);
      setWeather(weatherData);
    } catch (err) {
      setError(t('home.weatherError'));
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
            title: t('home.locationDenied'),
            description: "Showing weather for the default location."
          });
          // On denial, explicitly fetch for default location
          fetchWeatherForLocation(28.6139, 77.2090, 'Delhi, IN');
        }
      );
    } else {
       toast({
          variant: 'default',
          title: t('home.geolocationNotSupported'),
          description: "Showing weather for the default location."
        });
        fetchWeatherForLocation(28.6139, 77.2090, 'Delhi, IN');
    }
  }, [fetchWeatherForLocation, t, toast]);

  useEffect(() => {
    requestLocationAndUpdateWeather();
  }, [requestLocationAndUpdateWeather]);

  useEffect(() => {
    if (!loading && weather.currentWeather.location !== 'Loading...') {
        const { windSpeed, temperature, condition } = weather.currentWeather;

        if (windSpeed > windThreshold) {
            toast({
                variant: 'destructive',
                title: 'High Wind Alert',
                description: `Strong winds of ${weather.currentWeather.wind} detected. This may cause damage to tall crops or lightweight structures.`,
                duration: 8000,
            });
        }

        if (temperature > heatThreshold) {
            toast({
                variant: 'destructive',
                title: 'Heatwave Alert',
                description: `Extreme heat of ${temperature}°C expected. Ensure crops are well-irrigated to prevent heat stress.`,
                duration: 8000,
            });
        }

        if (temperature < coldThreshold) {
            toast({
                variant: 'destructive',
                title: 'Cold Snap Alert',
                description: `Low temperatures of ${temperature}°C detected. Protect sensitive crops from potential frost damage.`,
                duration: 8_000,
            });
        }
        
        const lowerCaseCondition = condition.toLowerCase();
        if (lowerCaseCondition.includes('heavy rain') || lowerCaseCondition.includes('thunderstorm')) {
            toast({
                variant: 'destructive',
                title: 'Heavy Rain Warning',
                description: 'Heavy rainfall is occurring. Be aware of potential for waterlogging in fields and plan drainage accordingly.',
                duration: 8000,
            });
        }
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
    if (lowerCaseCondition.includes('rain')) {
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
              <span>{loading ? t('home.fetchingLocation') : currentWeather.location}</span>
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
            ) : (
                <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Thermometer className="w-6 h-6 text-primary" />
                          <span className="text-4xl font-bold">{currentWeather.temperature}°C</span>
                      </div>
                      <div className='flex flex-col items-center'>
                          <WeatherIcon condition={currentWeather.condition} className="w-8 h-8 text-yellow-500" />
                          <p className="text-lg text-muted-foreground">{currentWeather.condition}</p>
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
        {error && !loading && <p className="text-center text-red-600 dark:text-red-400 mt-2">{error}</p>}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-center text-primary">
          {t('home.forecastTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <Card key={index} className="flex flex-col items-center p-4 shadow-md transition-transform hover:scale-105 hover:shadow-xl">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-24">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                 </div>
              ) : (
                <>
                    <p className="font-bold">{day.day}</p>
                    <div className="my-2">
                        <WeatherIcon condition={day.condition} className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-semibold">{day.temp}°C</p>
                </>
              )}
            </Card>
          ))}
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
