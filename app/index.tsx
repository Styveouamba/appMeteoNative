import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, Image, ActivityIndicator } from 'react-native';
import { fetchWeather } from '../services/weatherService';

interface Weather {
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
  };
}

export default function Index() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const getWeather = async () => {
    if (!city) {
      Alert.alert('Veuillez entrer un nom de ville');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchWeather(city, unit);
      setWeather(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const convertTemp = (temp: number) => {
    return unit === 'metric' ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Entrez le nom de la ville"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Obtenir la météo" onPress={getWeather} />
      <Button title={`Changer à ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`} onPress={toggleUnit} />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {weather && !loading && (
        <View style={styles.weatherInfo}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{convertTemp(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
            style={styles.icon}
          />
          <Text style={styles.description}>{weather.weather[0].description}</Text>
          <Text style={styles.details}>Pression: {weather.main.pressure} hPa</Text>
          <Text style={styles.details}>Humidité: {weather.main.humidity}%</Text>
          <Text style={styles.details}>Vitesse du vent: {weather.wind.speed} m/s</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 48,
  },
  description: {
    fontSize: 18,
    color: '#555',
  },
  details: {
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
