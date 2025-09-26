
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CurrentWeather } from '@/lib/weather-data';
import { AlertTriangle, Wind, Thermometer } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

interface WeatherAlertsProps {
  weather: CurrentWeather;
}

const WIND_THRESHOLD = 30; // km/h
const HEAT_THRESHOLD = 35; // °C
const COLD_THRESHOLD = 5; // °C

export function WeatherAlerts({ weather }: WeatherAlertsProps) {
  const { t } = useTranslation();
  const alerts = [];

  const windSpeed = parseFloat(weather.wind);
  if (windSpeed > WIND_THRESHOLD) {
    alerts.push({
      id: 'wind',
      title: 'High Wind Alert',
      description: `Strong winds of ${weather.wind} detected. This may cause damage to tall crops or lightweight structures.`,
      icon: <Wind className="h-5 w-5" />,
    });
  }

  if (weather.temperature > HEAT_THRESHOLD) {
    alerts.push({
      id: 'heat',
      title: 'Heatwave Alert',
      description: `Extreme heat of ${weather.temperature}°C expected. Ensure crops are well-irrigated to prevent heat stress.`,
      icon: <Thermometer className="h-5 w-5" />,
    });
  }

  if (weather.temperature < COLD_THRESHOLD) {
    alerts.push({
      id: 'cold',
      title: 'Cold Snap Alert',
      description: `Low temperatures of ${weather.temperature}°C detected. Protect sensitive crops from potential frost damage.`,
      icon: <Thermometer className="h-5 w-5" />,
    });
  }
  
  if (weather.condition.toLowerCase() === 'rainy') {
    alerts.push({
        id: 'rain',
        title: 'Heavy Rain Warning',
        description: 'Heavy rainfall is occurring. Be aware of potential for waterlogging in fields and plan drainage accordingly.',
        icon: <AlertTriangle className="h-5 w-5" />,
    });
  }


  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold font-headline text-center">
        Live Weather Alerts
      </h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant="destructive">
            <div className="flex items-start gap-4">
              {alert.icon}
              <div>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
}
