'use server';

export type CurrentWeather = {
  location: string;
  temperature: number;
  condition: string;
  wind: string;
  humidity: string;
  windSpeed: number;
};

export type ForecastDay = {
  day: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Clear';
};

const weatherConditionMap = {
  'clear sky': 'Sunny',
  'few clouds': 'Cloudy',
  'scattered clouds': 'Cloudy',
  'broken clouds': 'Cloudy',
  'shower rain': 'Rainy',
  rain: 'Rainy',
  thunderstorm: 'Rainy',
  snow: 'Rainy',
  mist: 'Cloudy',
  default: 'Cloudy',
};

const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

export async function getRealTimeWeather(
  lat: number,
  lon: number,
  fallbackCityName?: string
): Promise<{
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}> {
  if (!openWeatherMapApiKey) {
    console.error('OpenWeatherMap API key is missing.');
    // Return default data to prevent app crash
    return {
      currentWeather: {
        location: fallbackCityName || 'API Key Missing',
        temperature: 0,
        condition: '...',
        wind: '... km/h',
        humidity: '...%',
        windSpeed: 0,
      },
      forecast: Array(7).fill({ day: '...', temp: 0, condition: 'Cloudy' }),
    };
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${openWeatherMapApiKey}&units=metric`
      ),
    ]);

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather data fetch failed: ${weatherResponse.statusText}`
      );
    }
    if (!forecastResponse.ok) {
      throw new Error(
        `Forecast data fetch failed: ${forecastResponse.statusText}`
      );
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    
    const locationName = (weatherData.name && weatherData.sys.country 
        ? `${weatherData.name}, ${weatherData.sys.country}` 
        : fallbackCityName) || 'Unknown Location';

    const currentWeather: CurrentWeather = {
      location: locationName,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      wind: `${weatherData.wind.speed} km/h`,
      humidity: `${weatherData.main.humidity}%`,
      windSpeed: weatherData.wind.speed,
    };

    const forecast: ForecastDay[] = forecastData.list.map((day: any) => {
      const date = new Date(day.dt * 1000);
      const condition =
        (weatherConditionMap as any)[day.weather[0].description] ||
        weatherConditionMap.default;

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(day.temp.day),
        condition: condition,
      };
    });

    return { currentWeather, forecast };
  } catch (error) {
    console.error('Failed to get real-time weather:', error);
    // Provide a structured fallback in case of any error
    return {
      currentWeather: {
        location: fallbackCityName || 'Default Location',
        temperature: 25,
        condition: 'Cloudy',
        wind: '10 km/h',
        humidity: '60%',
        windSpeed: 10,
      },
      forecast: [
        { day: 'Mon', temp: 26, condition: 'Sunny' },
        { day: 'Tue', temp: 27, condition: 'Sunny' },
        { day: 'Wed', temp: 25, condition: 'Cloudy' },
        { day: 'Thu', temp: 24, condition: 'Rainy' },
        { day: 'Fri', temp: 24, condition: 'Rainy' },
        { day: 'Sat', temp: 26, condition: 'Cloudy' },
        { day: 'Sun', temp: 27, condition: 'Sunny' },
      ],
    };
  }
}
