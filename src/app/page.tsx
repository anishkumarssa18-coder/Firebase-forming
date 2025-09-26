'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRealTimeWeather, type CurrentWeather, type ForecastDay } from '@/lib/weather-data';
import { ArrowRight, Cloud, Droplets, Sun, Thermometer, Wind, CloudRain, LocateFixed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

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
  },
  forecast: Array(7).fill({ day: '...', temp: 0, condition: 'Cloudy' })
};

export default function Home() {
  const [weather, setWeather] = useState(defaultWeather);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherForLocation = useCallback(async (lat: number, lon: number) => {
    setError(null);
    setLoading(true);
    try {
      const weatherData = await getRealTimeWeather(lat, lon);
      setWeather(weatherData);
    } catch (err) {
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherForLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Location access denied. Showing weather for a default location.');
          // Fallback to a default location (e.g., Delhi, IN)
          fetchWeatherForLocation(28.6139, 77.2090);
        }
      );
    } else {
      setError('Geolocation is not supported. Showing weather for a default location.');
      // Fallback to a default location
      fetchWeatherForLocation(28.6139, 77.2090);
    }
  }, [fetchWeatherForLocation]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const { currentWeather, forecast } = weather;

  const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className={className} />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className={className} />;
      case 'rain':
      case 'rainy':
        return <CloudRain className={className} />;
      default:
        return <Cloud className={className} />;
    }
  };

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Welcome to Farming Master
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your AI-powered partner for smarter farming. Get instant advice, weather updates, and disease diagnosis to maximize your yield.
        </p>
        
        <Card className="max-w-md mx-auto shadow-lg border-2 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{loading ? 'Fetching location...' : currentWeather.location}</span>
              <Button variant="ghost" size="icon" onClick={getLocation} disabled={loading} className="w-8 h-8">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
                  <span className="sr-only">Refresh Location</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading ? (
                <div className="flex flex-col items-center justify-center h-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">Loading weather...</p>
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
                      <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-muted-foreground" /> Wind: {currentWeather.wind}</div>
                      <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-muted-foreground" /> Humidity: {currentWeather.humidity}</div>
                    </div>
                </>
            )}
          </CardContent>
        </Card>
        {error && !loading && <p className="text-center text-yellow-600 dark:text-yellow-400 mt-2">{error}</p>}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-center">
          7-Day Forecast
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
          <h2 className="text-2xl md:text-3xl font-bold font-headline">
            Have a Question?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get instant, AI-powered answers to your farming questions.
          </p>
          <Button asChild size="lg" className="mt-6 animate-pulse">
            <Link href="/query">
              Ask AI Assistant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
