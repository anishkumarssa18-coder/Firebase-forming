'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { alerts, type Alert as AlertType } from '@/lib/alerts-data';
import { cn } from '@/lib/utils';
import { AlertOctagon, AlertTriangle, Info, Calendar, Clock } from 'lucide-react';
import React from 'react';
import { useTranslation } from '@/context/language-context';

const severityConfig = {
  info: {
    icon: <Info className="h-5 w-5" />,
    style: 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    style: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-800 dark:text-yellow-300',
  },
  critical: {
    icon: <AlertOctagon className="h-5 w-5" />,
    style: 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300',
  },
};

const AlertCard: React.FC<{ alert: AlertType }> = ({ alert }) => {
  const { t } = useTranslation();
  const config = severityConfig[alert.severity];
  const alertDate = new Date(alert.date);
  const translatedTitle = t(`alerts.items.${alert.id}.title`);
  const translatedDescription = t(`alerts.items.${alert.id}.description`);


  return (
    <Card className={cn('shadow-md transition-all hover:shadow-lg hover:-translate-y-1', config.style)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={cn('flex-shrink-0')}>{config.icon}</span>
            <CardTitle className="text-lg font-semibold">{translatedTitle}</CardTitle>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-2 text-xs text-foreground/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{alertDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{alertDate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <CardDescription className="pt-2 pl-8 text-foreground/80">{translatedDescription}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default function AlertsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('alerts.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('alerts.description')}
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
