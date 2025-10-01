'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Thermometer, Wind, Snowflake } from 'lucide-react';

interface WeatherAlertSettingsProps {
  windThreshold: number;
  heatThreshold: number;
  coldThreshold: number;
  onWindChange: (value: number) => void;
  onHeatChange: (value: number) => void;
  onColdChange: (value: number) => void;
}

export function WeatherAlertSettings({
  windThreshold,
  heatThreshold,
  coldThreshold,
  onWindChange,
  onHeatChange,
  onColdChange,
}: WeatherAlertSettingsProps) {
  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">Weather Alert Settings</CardTitle>
        <CardDescription>Customize the thresholds for weather alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="wind-threshold" className="flex items-center gap-2 font-semibold">
              <Wind className="w-5 h-5 text-muted-foreground" />
              High Wind Threshold
            </Label>
            <span className="font-bold text-lg text-primary">{windThreshold} km/h</span>
          </div>
          <Slider
            id="wind-threshold"
            value={[windThreshold]}
            onValueChange={(value) => onWindChange(value[0])}
            max={80}
            step={1}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="heat-threshold" className="flex items-center gap-2 font-semibold">
              <Thermometer className="w-5 h-5 text-muted-foreground" />
              Heatwave Threshold
            </Label>
            <span className="font-bold text-lg text-primary">{heatThreshold}°C</span>
          </div>
          <Slider
            id="heat-threshold"
            value={[heatThreshold]}
            onValueChange={(value) => onHeatChange(value[0])}
            min={25}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cold-threshold" className="flex items-center gap-2 font-semibold">
              <Snowflake className="w-5 h-5 text-muted-foreground" />
              Cold Snap Threshold
            </Label>
            <span className="font-bold text-lg text-primary">{coldThreshold}°C</span>
          </div>
          <Slider
            id="cold-threshold"
            value={[coldThreshold]}
            onValueChange={(value) => onColdChange(value[0])}
            min={-10}
            max={15}
            step={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}
