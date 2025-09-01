import { useState, useEffect } from 'react';
import api from '../services/axios';

export const useLocationTracker = (user) => {
  // Minimum distance threshold for location updates (in meters)
  const LOCATION_THRESHOLD = 100;
  // Time interval for periodic updates (30 minutes in milliseconds)
  const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes
  // Fetch attendance status when user changes
  useEffect(() => {
    if (user?._id) {
      refetchAttendanceStatus();
    }
  }, [user]);
  // Helper to refetch attendance status
  const refetchAttendanceStatus = async () => {
    if (user?._id) {
      try {
        const res = await api.get(`/attendance/status/${user._id}`);
        setIsCheckedIn(res.data.hasCheckedIn);
        console.log('Attendance status (refetch):', res.data.hasCheckedIn ? 'Checked In' : 'Checked Out');
      } catch (err) {
        setIsCheckedIn(false);
        console.error('Error refetching attendance status:', err);
      }
    }
  };
  // Track last sent coordinates
  const [lastCoords, setLastCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(null);

  // Handle successful geolocation
  const handleLocationSuccess = async (position) => {
    const newLat = position.coords.latitude;
    const newLon = position.coords.longitude;
    const now = Date.now();
    // ...existing code...
    // (move all code from previous handleLocationSuccess here)
    // ...existing code...
  };

  // Handle geolocation errors
  const handleLocationError = (error) => {
    let errorMessage = 'Location access denied';
    // ...existing code...
    // (move all code from previous handleLocationError here)
    // ...existing code...
  };

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }
    setIsTracking(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      }
    );
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


  // Start/stop tracking when isCheckedIn changes
  useEffect(() => {
    if (isCheckedIn && !isTracking) {
      setLocationError(null);
      startTracking();
      console.log('Started location tracking after check-in.');
    }
    if (!isCheckedIn && isTracking) {
      stopTracking();
      setLocationError('Location tracking requires check-in. Please check in first.');
      console.log('Stopped location tracking after check-out.');
    }
  }, [isCheckedIn, isTracking]);
  // Expose refetchAttendanceStatus for check-in/check-out actions
  return {
    currentLocation,
    locationError,
    isTracking,
    startTracking,
    stopTracking,
    refetchAttendanceStatus,
    isCheckedIn
  };

  // Minimum distance threshold for location updates (in meters)

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
    if (!isCheckedIn) {
      setLocationError('Location tracking requires check-in. Please check in first.');
      console.log('Location update blocked: user is not checked in.');
      stopTracking();
      return;
    }
    const newLat = position.coords.latitude;
    const newLon = position.coords.longitude;
    let shouldUpdate = false;
    let overwrite = false;
    if (!lastUpdate) {
      // First update
      shouldUpdate = true;
      overwrite = false;
    } else {
      const now = new Date();
      const timeSinceLastUpdate = now - lastUpdate;
      if (lastCoords) {
        const dist = calculateDistance(lastCoords.lat, lastCoords.lon, newLat, newLon);
        if (dist < LOCATION_THRESHOLD) {
          // Same location, only update if 30 min passed
          if (timeSinceLastUpdate >= UPDATE_INTERVAL) {
            shouldUpdate = true;
            overwrite = true;
          }
        } else {
          // Location changed significantly
          shouldUpdate = true;
          overwrite = false;
        }
      } else {
        // No previous coords
        shouldUpdate = true;
        overwrite = false;
      }
    }
    if (!shouldUpdate) {
      console.log('No location update needed.');
      return;
    }
    try {
      const locationData = {
        latitude: newLat,
        longitude: newLon,
        accuracy: position.coords.accuracy || 0,
        hasLocationChanged: !overwrite,
        overwrite,
        ...addressData
      };
      console.log('Sending location update:', locationData);
      await api.post('/location/update', locationData);
      setCurrentLocation({
        latitude: newLat,
        longitude: newLon,
        timestamp: new Date(),
        accuracy: position.coords.accuracy
      });
      setLastUpdate(new Date());
      setLastCoords({ lat: newLat, lon: newLon });
      console.log('Location update successful.');
    } catch (error) {
      console.error('Error updating location:', error);
      if (error.response?.data?.requiresCheckIn) {
        setLocationError('Location tracking requires check-in. Please check in first.');
        stopTracking();
        console.log('Location update failed: requires check-in. Stopping tracking.');
      } else {
        setLocationError('Failed to update location in database');
        console.log('Location update failed: other error.');
      }
    }
  };



  // Auto-start tracking when user logs in
  useEffect(() => {
    if (user && !isTracking) {
      startTracking();
    }
    
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
    stopTracking,
    isCheckedIn,
    refetchAttendanceStatus
  };
};
