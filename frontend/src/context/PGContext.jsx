import React, { createContext, useContext, useState, useEffect } from 'react';
import { pgService } from '../services/api';

const PGContext = createContext();

export const PGProvider = ({ children }) => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await pgService.getAll();
      const validPgs = res.data.filter(pg => pg.lat !== undefined && pg.lng !== undefined && pg.lat !== null);
      
      const enriched = validPgs.map(pg => ({
        ...pg,
        tagline: "Verified Accommodation",
        reviews: pg.reviews?.length > 0 ? pg.reviews : [
          { user_name: "Rohan", food_rating: 5, room_rating: 4, comment: "Professional service and clean rooms." }
        ],
        images: ["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800"],
        room_options: pg.rooms?.length > 0 ? pg.rooms : [
          { room_type: 'Standard', price: 9000, occupied_beds: 2, total_beds: 5 }
        ],
        amenities: pg.amenities ? pg.amenities.split(',') : ["WiFi", "Laundry", "AC"],
        verified: true
      }));
      setPgs(enriched);
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PGContext.Provider value={{ pgs, loading, refreshData: fetchData }}>
      {children}
    </PGContext.Provider>
  );
};

export const usePGs = () => {
  const context = useContext(PGContext);
  if (!context) {
    throw new Error('usePGs must be used within a PGProvider');
  }
  return context;
};
