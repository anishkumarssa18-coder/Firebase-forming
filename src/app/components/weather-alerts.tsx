
'use client';

import type { CurrentWeather } from '@/lib/weather-data';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';

interface WeatherAlertsProps {
  weather: CurrentWeather;
}

const WIND_THRESHOLD = 30; // km/h
const HEAT_THRESHOLD = 35; // °C
const COLD_THRESHOLD = 5; // °C

export function WeatherAlerts({ weather }: WeatherAlertsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const windSpeed = parseFloat(weather.wind);
    if (windSpeed > WIND_THRESHOLD) {
      toast({
        variant: 'destructive',
        title: 'High Wind Alert',
        description: `Strong winds of ${weather.wind} detected. This may cause damage to tall crops or lightweight structures.`,
        duration: 8000,
      });
    }

    if (weather.temperature > HEAT_THRESHOLD) {
      toast({
        variant: 'destructive',
        title: 'Heatwave Alert',
        description: `Extreme heat of ${weather.temperature}°C expected. Ensure crops are well-irrigated to prevent heat stress.`,
        duration: 8000,
      });
    }

    if (weather.temperature < COLD_THRESHOLD) {
        toast({
        variant: 'destructive',
        title: 'Cold Snap Alert',
        description: `Low temperatures of ${weather.temperature}°C detected. Protect sensitive crops from potential frost damage.`,
        duration: 8000,
      });
    }
    
    if (weather.condition.toLowerCase() === 'rainy') {
        toast({
            variant: 'destructive',
            title: 'Heavy Rain Warning',
            description: 'Heavy rainfall is occurring. Be aware of potential for waterlogging in fields and plan drainage accordingly.',
            duration: 8000,
        });
    }
  }, [weather, toast, t]);


  return null;
}
