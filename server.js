import express from 'express';
import cors from 'cors';
import scrapeGoogleMaps from './src/api/googleMapsScraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for Google Maps scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const { businessType, subcategory, location, selectedLocalities, additionalKeywords, scrollCount } = req.body;
    
    if (!businessType || !subcategory || !location || !selectedLocalities || selectedLocalities.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Starting scrape with parameters:', {
      businessType,
      subcategory,
      location,
      selectedLocalities,
      additionalKeywords,
      scrollCount
    });

    // Format the query based on business type and subcategory
    const query = `${subcategory}`;
    
    // Map locality IDs to names for better search results
    const localities = selectedLocalities.map(localityId => {
      // Get the actual name from your locality data
      return localityId; // Just use the ID for now as placeholder
    });

    // Call the scraper
    const results = await scrapeGoogleMaps({
      query,
      location,
      localities,
      additionalKeywords,
      scrollCount: scrollCount || 5 // Use provided value or default to 5
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error in scrape endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 