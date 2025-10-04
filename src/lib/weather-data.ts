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
    const [weatherResponse, forecastResponse] = await Promise.all([
       fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}&units=metric`
      ),
    ]);

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      throw new Error(`Weather data fetch failed: ${weatherResponse.statusText} - ${errorData.message}`);
    }
     if (!forecastResponse.ok) {
       const errorData = await forecastResponse.json();
      throw new Error(`Forecast data fetch failed: ${forecastResponse.statusText} - ${errorData.message}`);
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    
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
    
    // Process the 5-day/3-hour forecast data to get a daily forecast for 7 days
    const dailyForecasts: { [key: string]: { temps: number[], conditions: string[] } } = {};

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayString = date.toLocaleDateString('en-US', { weekday: 'short' });

      if (!dailyForecasts[dayString]) {
        dailyForecasts[dayString] = { temps: [], conditions: [] };
      }
      dailyForecasts[dayString].temps.push(item.main.temp);
      dailyForecasts[dayString].conditions.push(item.weather[0].main);
    });

    // Sort days to ensure correct order starting from today
    const forecastOrder = Object.keys(dailyForecasts);

    const forecast: ForecastDay[] = forecastOrder.slice(0, 7).map(day => {
      const dayData = dailyForecasts[day];
      const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
      
      // Find the most frequent condition for the day
      const conditionCounts = dayData.conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {} as {[key: string]: number});
      const mainCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);

      return {
        day: day,
        temp: Math.round(avgTemp),
        condition: mainCondition,
      };
    });


    return { currentWeather, forecast };
  } catch (error) {
    console.error('Failed to get real-time weather:', error);
    // Re-throw the error to be caught by the calling component
    throw error;
  }
}
