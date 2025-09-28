import { NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/lib/firebase-admin';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CITY = "Chennai"; // Change to your city

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: 'OpenWeatherMap API key is not configured' }, { status: 500 });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);

    const weatherData = {
      city: CITY,
      temp: response.data.main.temp,
      condition: response.data.weather[0].description,
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await db.collection("weather").doc("current").set(weatherData);

    return NextResponse.json({ message: "Weather updated successfully", weatherData });

  } catch (error) {
    console.error("Error fetching weather:", error);
    return NextResponse.json({ error: 'Error fetching or saving weather data' }, { status: 500 });
  }
}
