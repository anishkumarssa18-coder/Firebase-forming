export type CurrentWeather = {
  location: string;
  temperature: number;
  condition: string;
  wind: string;
  humidity: string;
};

export type ForecastDay = {
  day: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy';
};

export function getCurrentWeather(): CurrentWeather {
  return {
    location: 'Central Valley, Punjab',
    temperature: 32,
    condition: 'Sunny',
    wind: '12 km/h',
    humidity: '65%',
  };
}

export function getForecast(): ForecastDay[] {
  return [
    { day: 'Mon', temp: 34, condition: 'Sunny' },
    { day: 'Tue', temp: 35, condition: 'Sunny' },
    { day: 'Wed', temp: 33, condition: 'Cloudy' },
    { day: 'Thu', temp: 30, condition: 'Rainy' },
    { day: 'Fri', temp: 31, condition: 'Rainy' },
    { day: 'Sat', temp: 32, condition: 'Cloudy' },
    { day: 'Sun', temp: 34, condition: 'Sunny' },
  ];
}
