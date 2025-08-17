import Location from '../model/Location.js';
import User from '../model/User.js';
import Attendance from '../model/Attendance.js';

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

// Update employee location
export const updateLocation = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      address, 
      city, 
      state, 
      country, 
      accuracy,
      hasLocationChanged 
    } = req.body;
    const userId = req.user._id;

    // Check if user is currently checked in
    const today = new Date().toISOString().split('T')[0];
    const currentAttendance = await Attendance.findOne({
      userId,
      date: today,
      status: "checked-in"
    });

    if (!currentAttendance) {
      return res.status(403).json({ 
        message: 'Location tracking is only active during work hours. Please check in first.',
        requiresCheckIn: true
      });
    }

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ message: 'Invalid latitude value' });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid longitude value' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const coordinates = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    // Get the user's last location entry
    const lastLocation = await Location.findOne({ 
      userId, 
      isActive: true 
    }).sort({ timestamp: -1 });

    let shouldCreateNewRecord = true;
    const now = new Date();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (lastLocation) {
      const timeDiff = now - lastLocation.timestamp;
      
      // Calculate distance between current and last location
      const distance = calculateDistance(
        lastLocation.coordinates.latitude,
        lastLocation.coordinates.longitude,
        coordinates.latitude,
        coordinates.longitude
      );
      
      const locationHasChanged = distance >= 100; // 100 meters threshold
      
      // Decision logic:
      // 1. If less than 30 minutes AND location hasn't changed significantly -> OVERWRITE
      // 2. If 30+ minutes have passed OR location has changed significantly -> NEW RECORD
      if (timeDiff < thirtyMinutes && !locationHasChanged) {
        // Update the existing record (overwrite)
        lastLocation.coordinates = coordinates;
        lastLocation.address = address || lastLocation.address;
        lastLocation.city = city || lastLocation.city;
        lastLocation.state = state || lastLocation.state;
        lastLocation.country = country || lastLocation.country;
        lastLocation.accuracy = accuracy || lastLocation.accuracy;
        lastLocation.timestamp = now;
        
        await lastLocation.save();
        shouldCreateNewRecord = false;
      }
    }

    if (shouldCreateNewRecord) {
      // Create new location record for significant changes or 30-minute intervals
      const newLocation = new Location({
        userId,
        coordinates,
        address: address || '',
        city: city || '',
        state: state || '',
        country: country || '',
        accuracy: accuracy || 0
      });

      await newLocation.save();
    }

    // Update user's current location
    await User.findByIdAndUpdate(userId, {
      currentLocation: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        lastUpdated: now
      }
    });

    res.status(200).json({ 
      message: 'Location updated successfully',
      updateType: shouldCreateNewRecord ? 'new_record' : 'overwrite',
      coordinates
    });

  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error while updating location' });
  }
};

// Get employee's current location
export const getCurrentLocation = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentLocation = await Location.findOne({ 
      userId,
      isActive: true 
    }).sort({ timestamp: -1 });

    if (!currentLocation) {
      return res.status(404).json({ message: 'No location data found' });
    }

    res.status(200).json({
      location: currentLocation
    });

  } catch (error) {
    console.error('Get current location error:', error);
    res.status(500).json({ message: 'Server error while fetching location' });
  }
};

// Get employee's location history
export const getLocationHistory = async (req, res) => {
  try {
    // Check if userId is provided in query (for admin requests)
    const targetUserId = req.query.userId || req.user._id;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    // If requesting another user's history, check if current user is admin
    if (req.query.userId && req.query.userId !== req.user._id.toString()) {
      if (req.user.role !== 'admin' && req.user.role !== 'hr') {
        return res.status(403).json({ message: 'Access denied. Admin or HR privileges required.' });
      }
    }

    const query = { userId: targetUserId, isActive: true };

    // Date filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRecords = await Location.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      success: true,
      locations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get location history error:', error);
    res.status(500).json({ message: 'Server error while fetching location history' });
  }
};

// HR/Admin: Get all employees' current locations
export const getAllEmployeeLocations = async (req, res) => {
  try {
    // Get latest location for each user (both active and inactive)
    const locations = await Location.aggregate([
      {
        $sort: { userId: 1, timestamp: -1 }
      },
      {
        $group: {
          _id: '$userId',
          latestLocation: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$latestLocation._id',
          userId: '$latestLocation.userId',
          userName: '$user.name',
          userEmail: '$user.email',
          employeeId: '$user.employeeId',
          coordinates: '$latestLocation.coordinates',
          address: '$latestLocation.address',
          city: '$latestLocation.city',
          state: '$latestLocation.state',
          country: '$latestLocation.country',
          timestamp: '$latestLocation.timestamp',
          isActive: '$latestLocation.isActive'
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ]);

    // Format the response to include user details in currentLocation
    const employees = await User.find({}, 'name email employeeId currentLocation')
      .lean();

    // Merge location data with user data
    const employeeLocations = employees.map(user => {
      const locationData = locations.find(loc => loc.userId.toString() === user._id.toString());
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        currentLocation: user.currentLocation,
        lastLocationUpdate: locationData ? locationData.timestamp : null,
        latestLocationData: locationData || null,
        isLocationActive: locationData ? locationData.isActive : false
      };
    });

    res.status(200).json({
      success: true,
      employees: employeeLocations,
      count: employeeLocations.length
    });

  } catch (error) {
    console.error('Get all employee locations error:', error);
    res.status(500).json({ message: 'Server error while fetching employee locations' });
  }
};

// Clear all location history (Admin only)
export const clearAllLocationHistory = async (req, res) => {
  try {
    // Check if user is admin (you might want to add role checking here)
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Add admin role check if you have roles implemented
    // if (user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    // }

    // Delete all location records
    const result = await Location.deleteMany({});
    
    res.status(200).json({ 
      message: 'All location history cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing location history:', error);
    res.status(500).json({ message: 'Failed to clear location history' });
  }
};
