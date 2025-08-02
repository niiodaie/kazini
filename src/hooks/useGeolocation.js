import { useState, useEffect } from 'react';

/**
 * Custom hook for accurate geolocation detection using ipapi.co
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState({
    country: '',
    city: '',
    region: '',
    countryCode: '',
    timezone: '',
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // First try to get cached location
        const cachedLocation = localStorage.getItem('kazini_location');
        if (cachedLocation) {
          try {
            const parsed = JSON.parse(cachedLocation);
            // Check if cached data is less than 24 hours old
            const cacheAge = Date.now() - (parsed.timestamp || 0);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (cacheAge < maxAge) {
              setLocation(prev => ({
                ...prev,
                ...parsed,
                loading: false
              }));
              return;
            }
          } catch (err) {
            console.warn('Failed to parse cached location:', err);
            localStorage.removeItem('kazini_location');
          }
        }

        // Fetch fresh location data from ipapi.co
        console.log('Fetching location from ipapi.co...');
        
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check for API error
        if (data.error) {
          throw new Error(data.reason || 'API error');
        }

        const locationData = {
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || '',
          countryCode: data.country_code || '',
          timezone: data.timezone || '',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          loading: false,
          error: null,
          timestamp: Date.now()
        };

        setLocation(locationData);
        
        // Cache the result
        localStorage.setItem('kazini_location', JSON.stringify(locationData));
        
        console.log('Location detected:', locationData);

      } catch (error) {
        console.error('Geolocation detection failed:', error);
        
        // Fallback to default location
        const fallbackLocation = {
          country: 'United States',
          city: 'New York',
          region: 'New York',
          countryCode: 'US',
          timezone: 'America/New_York',
          latitude: 40.7128,
          longitude: -74.0060,
          loading: false,
          error: error.message
        };

        setLocation(fallbackLocation);
        
        // Cache fallback for a shorter time (1 hour)
        const fallbackWithTimestamp = {
          ...fallbackLocation,
          timestamp: Date.now() - (23 * 60 * 60 * 1000) // Expire in 1 hour
        };
        localStorage.setItem('kazini_location', JSON.stringify(fallbackWithTimestamp));
      }
    };

    detectLocation();
  }, []);

  // Refresh location manually
  const refreshLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    // Clear cache
    localStorage.removeItem('kazini_location');
    
    // Re-trigger detection
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'API error');
      }

      const locationData = {
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || '',
        countryCode: data.country_code || '',
        timezone: data.timezone || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        loading: false,
        error: null,
        timestamp: Date.now()
      };

      setLocation(locationData);
      localStorage.setItem('kazini_location', JSON.stringify(locationData));
      
      return locationData;
    } catch (error) {
      console.error('Manual location refresh failed:', error);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  // Get formatted location string
  const getFormattedLocation = () => {
    if (location.loading) return 'Detecting location...';
    if (location.error) return 'Location unavailable';
    
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    } else if (location.country) {
      return location.country;
    } else {
      return 'Unknown location';
    }
  };

  // Get location flag emoji (basic implementation)
  const getLocationFlag = () => {
    const flagMap = {
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'GB': '🇬🇧',
      'FR': '🇫🇷',
      'DE': '🇩🇪',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'AU': '🇦🇺',
      'MX': '🇲🇽',
      'RU': '🇷🇺',
      'KR': '🇰🇷',
    };
    
    return flagMap[location.countryCode] || '🌍';
  };

  return {
    location,
    refreshLocation,
    getFormattedLocation,
    getLocationFlag,
    isLoading: location.loading,
    hasError: !!location.error,
    error: location.error
  };
};

