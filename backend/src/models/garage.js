import pool from '../config/db.js';

class Garage {
  // Create a new garage
  static async create(ownerId, title, description, address, city, state, zipCode, pricePerHour, pricePerDay, width, length, height, features = [], images = []) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert into garages table
      const garageQuery = `
        INSERT INTO garages (owner_id, title, description, address, city, state, zip_code, 
                          price_per_hour, price_per_day, width, length, height)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const garageValues = [
        ownerId, title, description, address, city, state, zipCode, 
        pricePerHour, pricePerDay, width, length, height
      ];
      
      const garageResult = await client.query(garageQuery, garageValues);
      const garage = garageResult.rows[0];
      
      // Insert features if any
      if (features && features.length > 0) {
        const featureQuery = `
          INSERT INTO garage_features (garage_id, feature_name)
          VALUES ($1, $2)
        `;
        
        for (const feature of features) {
          await client.query(featureQuery, [garage.id, feature]);
        }
      }
      
      // Insert images if any
      if (images && images.length > 0) {
        const imageQuery = `
          INSERT INTO garage_images (garage_id, image_url)
          VALUES ($1, $2)
        `;
        
        for (const image of images) {
          await client.query(imageQuery, [garage.id, image]);
        }
      }
      
      await client.query('COMMIT');
      return garage;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get all garages with pagination
  static async getAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT g.*, 
             AVG(r.rating) as average_rating,
             COUNT(r.id) as review_count,
             json_agg(DISTINCT gi.image_url) as images,
             json_agg(DISTINCT gf.feature_name) as features
      FROM garages g
      LEFT JOIN garage_images gi ON g.id = gi.garage_id
      LEFT JOIN garage_features gf ON g.id = gf.garage_id
      LEFT JOIN ratings r ON g.id = r.garage_id
    `;
    
    const queryParams = [];
    let whereClause = [];
    
    // Apply filters
    if (filters.city) {
      queryParams.push(filters.city);
      whereClause.push(`g.city ILIKE '%' || $${queryParams.length} || '%'`);
    }
    
    if (filters.minPrice) {
      queryParams.push(filters.minPrice);
      whereClause.push(`g.price_per_day >= $${queryParams.length}`);
    }
    
    if (filters.maxPrice) {
      queryParams.push(filters.maxPrice);
      whereClause.push(`g.price_per_day <= $${queryParams.length}`);
    }
    
    if (filters.features && filters.features.length > 0) {
      const featuresList = filters.features.join("','");
      whereClause.push(`g.id IN (SELECT garage_id FROM garage_features WHERE feature_name IN ('${featuresList}'))`);
    }
    
    if (whereClause.length > 0) {
      query += ` WHERE ${whereClause.join(' AND ')}`;
    }
    
    query += `
      GROUP BY g.id
      ORDER BY g.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    queryParams.push(limit, offset);
    
    // Count total for pagination
    let countQuery = 'SELECT COUNT(*) FROM garages g';
    if (whereClause.length > 0) {
      countQuery += ` WHERE ${whereClause.join(' AND ')}`;
    }
    
    try {
      const garagesResult = await pool.query(query, queryParams);
      const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
      
      return {
        garages: garagesResult.rows,
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get garage by ID
  static async getById(id) {
    const query = `
      SELECT g.*, 
             AVG(r.rating) as average_rating,
             COUNT(r.id) as review_count,
             json_agg(DISTINCT gi.image_url) as images,
             json_agg(DISTINCT gf.feature_name) as features,
             json_agg(DISTINCT jsonb_build_object(
               'id', r.id, 
               'rating', r.rating, 
               'comment', r.comment, 
               'user_id', r.user_id, 
               'created_at', r.created_at
             )) as reviews
      FROM garages g
      LEFT JOIN garage_images gi ON g.id = gi.garage_id
      LEFT JOIN garage_features gf ON g.id = gf.garage_id
      LEFT JOIN ratings r ON g.id = r.garage_id
      WHERE g.id = $1
      GROUP BY g.id
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user's garages
  static async getByOwnerId(ownerId) {
    const query = `
      SELECT g.*, 
             AVG(r.rating) as average_rating,
             COUNT(r.id) as review_count,
             json_agg(DISTINCT gi.image_url) as images
      FROM garages g
      LEFT JOIN garage_images gi ON g.id = gi.garage_id
      LEFT JOIN ratings r ON g.id = r.garage_id
      WHERE g.owner_id = $1
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [ownerId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Garage;
