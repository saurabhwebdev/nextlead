import express from 'express';
import cors from 'cors';
import { scrapeGoogleMaps } from './src/api/googleMapsScraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for development
const getMockResults = () => {
  const mockResults = [];
  
  // Generate 20 mock businesses
  for (let i = 1; i <= 20; i++) {
    mockResults.push({
      title: `Business Name ${i}`,
      rating: `${(Math.random() * 2 + 3).toFixed(1)}`,
      reviews: `${Math.floor(Math.random() * 500)}`,
      type: i % 5 === 0 ? 'Restaurant' : i % 4 === 0 ? 'Cafe' : i % 3 === 0 ? 'Store' : i % 2 === 0 ? 'Shop' : 'Service',
      address: `${Math.floor(Math.random() * 999)} Sample Street, City ${i % 5 + 1}`,
      openState: i % 3 === 0 ? 'Closed' : i % 2 === 0 ? 'Open now' : 'Opens at 9 AM',
      phone: `+1 (${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: i % 3 === 0 ? `https://example${i}.com` : '',
      description: 'Sample business description',
      serviceOptions: i % 4 === 0 ? 'Dine-in · Takeout · Delivery' : i % 3 === 0 ? 'Dine-in · Takeout' : i % 2 === 0 ? 'Takeout · Delivery' : '',
      coordinates: { latitude: `${Math.random() * 90}`, longitude: `${Math.random() * 180}` },
      thumbnail: '',
      searchQuery: 'mock search'
    });
  }
  
  return { success: true, results: mockResults };
};

// Endpoint to handle Google Maps scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const { useMockData, ...searchParams } = req.body;
    
    // Use mock data for development or testing
    if (useMockData) {
      return res.json(getMockResults());
    }
    
    const results = await scrapeGoogleMaps(searchParams);
    return res.json({ success: true, results });
  } catch (error) {
    console.error('Error in scraping endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to scrape data',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 