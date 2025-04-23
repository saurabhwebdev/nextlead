import express from 'express';
import cors from 'cors';
import { scrapeGoogleMaps } from './src/api/googleMapsScraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to handle Google Maps scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const searchParams = req.body;
    
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