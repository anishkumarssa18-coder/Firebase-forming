export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
};

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Pest Risk Alert: High Humidity',
    description: 'High humidity and recent rainfall increase the risk of fungal diseases and aphid infestations. Monitor crops closely.',
    severity: 'warning',
    date: '2024-07-20T10:30:00Z',
  },
  {
    id: 'alert-2',
    title: 'Heatwave Warning for Next 48 Hours',
    description: 'Temperatures are expected to exceed 40°C. Ensure adequate irrigation for all crops to prevent heat stress.',
    severity: 'critical',
    date: '2024-07-19T14:00:00Z',
  },
  {
    id: 'alert-3',
    title: 'PM-KISAN Scheme: Next Installment Update',
    description: 'The next installment of the PM-KISAN scheme is scheduled to be released by the end of the month. Ensure your eKYC is complete.',
    severity: 'info',
    date: '2024-07-18T09:00:00Z',
  },
  {
    id: 'alert-4',
    title: 'Moderate Rainfall Predicted',
    description: 'Moderate rainfall expected over the weekend. Plan harvesting activities accordingly to avoid crop damage.',
    severity: 'info',
    date: '2024-07-17T18:00:00Z',
  },
  {
    id: 'alert-5',
    title: 'Locust Swarm Sighting Reported',
    description: 'Small locust swarms have been reported in neighboring districts. Be vigilant and report any sightings immediately.',
    severity: 'critical',
    date: '2024-07-16T11:45:00Z',
  },
];
