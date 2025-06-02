import Garage from '../models/garage.js';
import Booking from '../models/booking.js';

// Create a new garage
export const createGarage = async (req, res) => {
  try {
    const { 
      title, description, address, city, state, zipCode, 
      pricePerHour, pricePerDay, width, length, height, features, images 
    } = req.body;
    
    const ownerId = req.user.id;
    
    // Validate required fields
    if (!title || !address || !city || !state || !zipCode || !pricePerDay) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create the garage
    const garage = await Garage.create(
      ownerId,
      title,
      description,
      address,
      city,
      state,
      zipCode,
      pricePerHour,
      pricePerDay,
      width,
      length,
      height,
      features,
      images
    );
    
    res.status(201).json({
      success: true,
      garage
    });
  } catch (error) {
    console.error('Create garage error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all garages with filters and pagination
export const getAllGarages = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, minPrice, maxPrice, features } = req.query;
    
    // Parse features if present
    let featuresArray;
    if (features) {
      featuresArray = Array.isArray(features) ? features : [features];
    }
    
    // Get garages with filters
    const result = await Garage.getAll(
      parseInt(page),
      parseInt(limit),
      { 
        city,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        features: featuresArray
      }
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get all garages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get garage by ID
export const getGarageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const garage = await Garage.getById(id);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      garage
    });
  } catch (error) {
    console.error('Get garage error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user's garages
export const getUserGarages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const garages = await Garage.getByOwnerId(userId);
    
    res.status(200).json({
      success: true,
      garages
    });
  } catch (error) {
    console.error('Get user garages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update garage
export const updateGarage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { 
      title, description, address, city, state, zipCode, 
      pricePerHour, pricePerDay, width, length, height, features, images 
    } = req.body;
    
    // Check if garage exists and belongs to the user
    const garage = await Garage.getById(id);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    if (garage.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this garage' 
      });
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update garage details
      let updateQuery = `
        UPDATE garages
        SET title = $1, description = $2, address = $3, city = $4, 
            state = $5, zip_code = $6, price_per_hour = $7, price_per_day = $8, 
            width = $9, length = $10, height = $11, updated_at = NOW()
        WHERE id = $12
        RETURNING *
      `;
      
      let updateValues = [
        title, description, address, city, state, zipCode, 
        pricePerHour, pricePerDay, width, length, height, id
      ];
      
      const garageResult = await client.query(updateQuery, updateValues);
      const updatedGarage = garageResult.rows[0];
      
      // Update features if provided
      if (features && Array.isArray(features)) {
        // Delete existing features
        await client.query('DELETE FROM garage_features WHERE garage_id = $1', [id]);
        
        // Insert new features
        const featureQuery = `
          INSERT INTO garage_features (garage_id, feature_name)
          VALUES ($1, $2)
        `;
        
        for (const feature of features) {
          await client.query(featureQuery, [id, feature]);
        }
      }
      
      // Update images if provided
      if (images && Array.isArray(images)) {
        // Delete existing images
        await client.query('DELETE FROM garage_images WHERE garage_id = $1', [id]);
        
        // Insert new images
        const imageQuery = `
          INSERT INTO garage_images (garage_id, image_url)
          VALUES ($1, $2)
        `;
        
        for (const image of images) {
          await client.query(imageQuery, [id, image]);
        }
      }
      
      await client.query('COMMIT');
      
      // Get the updated garage with all relationships
      const fullGarage = await Garage.getById(id);
      
      res.status(200).json({
        success: true,
        garage: fullGarage
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update garage error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete garage
export const deleteGarage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if garage exists and belongs to the user
    const garage = await Garage.getById(id);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    if (garage.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this garage' 
      });
    }
    
    // Check if there are any active bookings
    const bookings = await Booking.getByGarageId(id);
    const activeBookings = bookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.end_date) >= new Date()
    );
    
    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete garage with active bookings' 
      });
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete related data first
      await client.query('DELETE FROM garage_features WHERE garage_id = $1', [id]);
      await client.query('DELETE FROM garage_images WHERE garage_id = $1', [id]);
      await client.query('DELETE FROM ratings WHERE garage_id = $1', [id]);
      
      // Update bookings to 'cancelled_by_owner' status
      await client.query(
        'UPDATE bookings SET status = $1, updated_at = NOW() WHERE garage_id = $2',
        ['cancelled_by_owner', id]
      );
      
      // Delete the garage
      await client.query('DELETE FROM garages WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      
      res.status(200).json({
        success: true,
        message: 'Garage deleted successfully'
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete garage error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Check garage availability
export const checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start and end dates are required' 
      });
    }
    
    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (start < now) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date cannot be in the past' 
      });
    }
    
    if (end <= start) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }
    
    // Get garage details
    const garage = await Garage.getById(id);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    // Get all bookings for the garage
    const bookings = await Booking.getByGarageId(id);
    
    // Filter confirmed bookings that overlap with the requested dates
    const conflictingBookings = bookings.filter(booking => {
      if (booking.status !== 'confirmed') return false;
      
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      
      // Check for overlap
      return (
        (start >= bookingStart && start < bookingEnd) || // Start date falls within a booking
        (end > bookingStart && end <= bookingEnd) || // End date falls within a booking
        (start <= bookingStart && end >= bookingEnd) // Booking falls within the requested dates
      );
    });
    
    const isAvailable = conflictingBookings.length === 0;
    
    res.status(200).json({
      success: true,
      isAvailable,
      conflictingDates: isAvailable ? [] : conflictingBookings.map(booking => ({
        startDate: booking.start_date,
        endDate: booking.end_date
      }))
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
