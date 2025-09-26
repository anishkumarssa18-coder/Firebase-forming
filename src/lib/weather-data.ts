
'use server';

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

const openWeatherMapApiKey = '92e82245a9d3c85a211341a7e44f43c8';

async function getCityName(lat: number, lon: number): Promise<string> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return 'Unknown Location';
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      const city = addressComponents.find((c: any) =>
        c.types.includes('locality')
      );
      const state = addressComponents.find((c: any) =>
        c.types.includes('administrative_area_level_1')
      );
      if (city && state) {
        return `${city.long_name}, ${state.short_name}`;
      }
      // Fallback to a broader location if city/state not found
      const area = addressComponents.find((c: any) => c.types.includes('administrative_area_level_2')) || addressComponents.find((c: any) => c.types.includes('political'));
      if (area) {
        return area.long_name;
      }
      return data.results[0].formatted_address;
    }
    return 'Unknown Location';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown Location';
  }
}

export async function getRealTimeWeather(
  lat: number,
  lon: number
): Promise<{
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}> {
  try {
    const [weatherResponse, forecastResponse, cityName] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}&units=metric`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${openWeatherMapApiKey}&units=metric`
      ),
      getCityName(lat, lon),
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

    const currentWeather: CurrentWeather = {
      location: cityName,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      wind: `${weatherData.wind.speed} km/h`,
      humidity: `${weatherData.main.humidity}%`,
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
    // Provide a more generic default location
    return {
      currentWeather: {
        location: 'Default Location',
        temperature: 25,
        condition: 'Sunny',
        wind: '10 km/h',
        humidity: '60%',
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
