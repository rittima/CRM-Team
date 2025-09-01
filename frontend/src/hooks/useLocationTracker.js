import { useState, useEffect } from 'react';
import api from '../services/axios';

export const useLocationTracker = (user) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Minimum distance threshold for location updates (in meters)
  const LOCATION_THRESHOLD = 100;
  
  // Time interval for periodic updates (30 minutes in milliseconds)
  const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes
  
  // Reference to tracking interval
  const [trackingInterval, setTrackingInterval] = useState(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return {
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village || '',
          state: data.address?.state || '',
          country: data.address?.country || ''
        };
      }
      return null;
    } catch (error) {
      console.warn('Error getting address:', error);
      return null;
    }
  };

  // Send location update to backend
  const updateLocationInDatabase = async (position, addressData = null, hasLocationChanged = false) => {
    try {
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0,
        hasLocationChanged, // Indicate if this is a new location or time-based update
        ...addressData
      };

      await api.post('/location/update', locationData);
      
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy
      });
      
      setLastUpdate(new Date());
      
    } catch (error) {
      // Handle specific case when user is not checked in
      if (error.response?.data?.requiresCheckIn) {
        console.log('Location tracking requires check-in. Stopping tracking.');
        setLocationError('Location tracking requires check-in. Please check in first.');
        stopTracking(); // Stop tracking if not checked in
      } else {
        console.error('Error updating location:', error);
        setLocationError('Failed to update location in database');
      }
    }
  };

  // Handle successful geolocation
  const handleLocationSuccess = async (position) => {
    const newLat = position.coords.latitude;
    const newLon = position.coords.longitude;
    const now = Date.now();
    
    // Check if enough time has passed for a periodic update (30 minutes)
    const timeSinceLastUpdate = lastUpdate ? now - lastUpdate.getTime() : UPDATE_INTERVAL;
    const shouldUpdateByTime = timeSinceLastUpdate >= UPDATE_INTERVAL;
    
    // Check if location has changed significantly
    let hasLocationChanged = false;
    if (currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        newLat,
        newLon
      );
      hasLocationChanged = distance >= LOCATION_THRESHOLD;
    } else {
      hasLocationChanged = true; // First location update
    }
    
    // Update if:
    // 1. It's the first location update, OR
    // 2. 30 minutes have passed (regardless of location change), OR
    // 3. Location has changed significantly
    if (!currentLocation || shouldUpdateByTime || hasLocationChanged) {
      // Get address information
      const addressData = await getAddressFromCoordinates(newLat, newLon);
      
      // Send location update with change indicator
      await updateLocationInDatabase(position, addressData, hasLocationChanged);
      
      setLocationError(null);
    }
  };

  // Handle geolocation errors
  const handleLocationError = (error) => {
    let errorMessage = 'Location access denied';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied by user';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'Unknown location error';
    }
    
    console.error('Location error:', errorMessage);
    setLocationError(errorMessage);
  };

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsTracking(true);
    setLocationError(null);

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      }
    );

    // Set up interval to check location every 30 minutes
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Don't use cached position for periodic checks
        }
      );
    }, UPDATE_INTERVAL);

    setTrackingInterval(intervalId);
    return intervalId;
  };

  // Stop location tracking
  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
    setIsTracking(false);
  };

  // Auto-start tracking when user logs in
  useEffect(() => {
    // Don't automatically start tracking when user is authenticated
    // Location tracking should only start when explicitly called (after check-in)
    
    // Cleanup on unmount or user logout
    return () => {
      stopTracking();
    };
  }, [user]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  // Listen for attendance events to refresh location status
  useEffect(() => {
    if (user) {
      const handleAttendanceEvent = (event) => {
        
        // If it's a check-in event, start tracking
        if (event.detail?.type === 'checkin') {
          setLocationError(null);
          if (!isTracking) {
            startTracking();
          }
        }
        
        // If it's a check-out event, stop tracking
        if (event.detail?.type === 'checkout') {
          stopTracking();
        }
        
        // Refresh current location display regardless of event type
        if (isTracking) {
          navigator.geolocation.getCurrentPosition(
            handleLocationSuccess,
            handleLocationError,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        }
      };

      // Listen for custom attendance events
      window.addEventListener('attendanceUpdate', handleAttendanceEvent);
      
      // Also listen for localStorage changes (in case of multiple tabs)
      const handleStorageChange = (e) => {
        if (e.key === 'attendanceEvent') {
          handleAttendanceEvent({ detail: { type: 'unknown' } });
        }
      };
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('attendanceUpdate', handleAttendanceEvent);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [user, isTracking]);

  return {
    currentLocation,
    locationError,
    isTracking,
    lastUpdate,
    startTracking,
    stopTracking
  };
};
