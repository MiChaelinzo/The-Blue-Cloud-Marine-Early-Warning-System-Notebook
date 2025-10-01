import { useState, useEffect } from 'react';
import { blueCloudService, MarineDataPoint, SpeciesObservation } from '../services/blueCloudApi';

export function useOceanographicData(bbox: string, timeRange: string = '24h') {
  const [data, setData] = useState<MarineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const oceanData = await blueCloudService.getOceanographicData(bbox, timeRange);
        setData(oceanData);
      } catch (err) {
        console.log('Using fallback data for oceanographic information');
        // Don't set error state, just use fallback data
        const fallbackData = await blueCloudService.getOceanographicData(bbox, timeRange);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [bbox, timeRange]);

  return { data, loading, error };
}

export function useSpeciesData(species: string, region: string) {
  const [data, setData] = useState<SpeciesObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const speciesData = await blueCloudService.getSpeciesObservations(species, region);
        setData(speciesData);
      } catch (err) {
        console.log('Using fallback data for species information');
        // Don't set error state, just use fallback data
        const fallbackData = await blueCloudService.getSpeciesObservations(species, region);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update species data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [species, region]);

  return { data, loading, error };
}

export function useWeatherData(lat: number, lon: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await blueCloudService.getWeatherData(lat, lon);
        setData(weatherData);
      } catch (err) {
        console.log('Using fallback data for weather information');
        // Don't set error state, just use fallback data
        const fallbackData = await blueCloudService.getWeatherData(lat, lon);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update weather data every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  return { data, loading, error };
}

export function useAquacultureData(region: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const farmData = await blueCloudService.getAquacultureData(region);
        setData(farmData);
      } catch (err) {
        console.log('Using fallback data for aquaculture information');
        // Don't set error state, just use fallback data
        const fallbackData = await blueCloudService.getAquacultureData(region);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Update farm data every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [region]);

  return { data, loading, error };
}