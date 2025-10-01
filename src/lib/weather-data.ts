'use server';

export type CurrentWeather = {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  wind: string;
  humidity: string;
  windSpeed: number;
};

export type ForecastDay = {
  day: string;
  temp: number;
  condition: string;
};

const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

export async function getRealTimeWeather(
  lat: number,
  lon: number,
): Promise<{
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}> {
  if (!openWeatherMapApiKey) {
    throw new Error('OpenWeatherMap API key is missing.');
  }

  try {
    const [weatherResponse, onecallResponse] = await Promise.all([
       fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${openWeatherMapApiKey}&units=metric`
      ),
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      throw new Error(`Weather data fetch failed: ${weatherResponse.statusText} - ${errorData.message}`);
    }
     if (!onecallResponse.ok) {
       const errorData = await onecallResponse.json();
      throw new Error(`OneCall forecast data fetch failed: ${onecallResponse.statusText} - ${errorData.message}`);
    }

    const weatherData = await weatherResponse.json();
    const onecallData = await onecallResponse.json();
    
    const locationName = (weatherData.name && weatherData.sys.country 
        ? `${weatherData.name}, ${weatherData.sys.country}` 
        : 'Unknown Location');

    const currentWeather: CurrentWeather = {
      location: locationName,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      wind: `${weatherData.wind.speed} km/h`,
      humidity: `${weatherData.main.humidity}%`,
      windSpeed: weatherData.wind.speed,
    };

    const forecast: ForecastDay[] = onecallData.daily.slice(0, 7).map((day: any) => {
      const date = new Date(day.dt * 1000);
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(day.temp.day),
        condition: day.weather[0].main,
      };
    });

    return { currentWeather, forecast };
  } catch (error) {
    console.error('Failed to get real-time weather:', error);
    // Re-throw the error to be caught by the calling component
    throw error;
  }
}
