import axios from 'axios';

const API_KEY = 'b94f5ffe278c91c8f1e6dfb37ff0691f'; // Remplace par ta clé API OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Définir les types pour les données météo
interface WeatherData {
  name: string; // Nom de la ville
  main: {
    temp: number; // Température
    pressure: number; // Pression
    humidity: number; // Humidité
  };
  weather: Array<{
    description: string; // Description de la météo
    icon: string; // Code de l'icône
  }>;
  wind: {
    speed: number; // Vitesse du vent
    deg: number; // Direction du vent
  };
  clouds: {
    all: number; // Couverture nuageuse
  };
  sys: {
    country: string; // Code du pays
    sunrise: number; // Heure du lever de soleil
    sunset: number; // Heure du coucher de soleil
  };
}

export const fetchWeather = async (city: string, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    return response.data;
  } catch (error) {
    throw new Error('Impossible de récupérer les données météo');
  }
};
