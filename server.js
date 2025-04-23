import express from 'express';
import cors from 'cors';
import scrapeGoogleMaps from './src/api/googleMapsScraper.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Store scraping sessions
const scrapingSessions = new Map();

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

// Initialize a scraping session for progress tracking
app.post('/api/scrape/init', (req, res) => {
  try {
    const { businessType, subcategory, location, selectedLocalities, additionalKeywords, scrollCount } = req.body;
    
    if (!businessType || !subcategory || !location || !selectedLocalities || selectedLocalities.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create a unique session ID
    const sessionId = uuidv4();
    
    // Store session data
    scrapingSessions.set(sessionId, {
      params: req.body,
      progress: 0,
      count: 0,
      area: '',
      clients: new Set(),
      complete: false,
      results: null,
      error: null
    });
    
    // Start the scraping process in the background
    setTimeout(() => {
      processScrapeJob(sessionId);
    }, 50);
    
    res.json({ sessionId });
  } catch (error) {
    console.error('Error initializing scrape:', error);
    res.status(500).json({ error: error.message || 'Failed to initialize scraping' });
  }
});

// Progress endpoint using Server-Sent Events
app.get('/api/scrape/progress/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // Check if session exists
  if (!scrapingSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Scraping session not found' });
  }
  
  // Get session data
  const session = scrapingSessions.get(sessionId);
  
  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Send initial progress
  sendProgress(res, {
    progress: session.progress,
    count: session.count,
    area: session.area
  });
  
  // Add client to session
  session.clients.add(res);
  
  // Handle client disconnect
  req.on('close', () => {
    session.clients.delete(res);
    
    // Clean up session if all clients are gone and it's complete
    if (session.clients.size === 0 && session.complete) {
      setTimeout(() => {
        scrapingSessions.delete(sessionId);
      }, 60000); // Keep session data for 1 minute after last client disconnects
    }
  });
  
  // If already complete, send final data
  if (session.complete) {
    if (session.error) {
      sendProgress(res, {
        progress: 100,
        error: session.error,
        complete: true
      });
    } else {
      sendProgress(res, {
        progress: 100,
        count: session.results.length,
        complete: true,
        results: { success: true, results: session.results }
      });
    }
  }
});

// Helper to send progress to SSE clients
function sendProgress(client, data) {
  client.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Process a scraping job in the background
async function processScrapeJob(sessionId) {
  const session = scrapingSessions.get(sessionId);
  if (!session) return;
  
  try {
    const { businessType, subcategory, location, selectedLocalities, additionalKeywords, scrollCount } = session.params;
    
    // Format the query
    const query = `${subcategory}`;
    
    // Process each locality
    const allResults = [];
    const totalLocalities = selectedLocalities.length;
    
    for (let i = 0; i < totalLocalities; i++) {
      const locality = selectedLocalities[i];
      
      // Update progress and notify clients
      session.progress = Math.min(95, Math.floor(20 + (i / totalLocalities) * 75));
      session.area = locality;
      
      // Notify all clients
      session.clients.forEach(client => {
        sendProgress(client, {
          progress: session.progress,
          count: session.count,
          area: session.area
        });
      });
      
      // Process this locality
      try {
        // Simulate scraping with timeouts based on scroll count
        const localityResults = await simulateLocalityScrape(query, location, locality, scrollCount);
        
        // Update count and results
        allResults.push(...localityResults);
        session.count = allResults.length;
        
        // Notify clients of count update
        session.clients.forEach(client => {
          sendProgress(client, {
            progress: session.progress,
            count: session.count,
            area: session.area
          });
        });
      } catch (error) {
        console.error(`Error scraping locality ${locality}:`, error);
      }
    }
    
    // Mark job as complete
    session.complete = true;
    session.results = allResults;
    
    // Send final data to clients
    session.clients.forEach(client => {
      sendProgress(client, {
        progress: 100,
        count: allResults.length,
        complete: true,
        results: { success: true, results: allResults }
      });
    });
  } catch (error) {
    console.error('Error processing scrape job:', error);
    
    // Mark job as failed
    session.complete = true;
    session.error = error.message || 'Scraping failed';
    
    // Notify clients of error
    session.clients.forEach(client => {
      sendProgress(client, {
        progress: 100,
        error: session.error,
        complete: true
      });
    });
  }
}

// Helper to simulate scraping a single locality
function simulateLocalityScrape(query, location, locality, scrollCount) {
  return new Promise(async (resolve) => {
    try {
      // Use real Google Maps scraper
      const results = await scrapeGoogleMaps({
        query,
        location,
        localities: [locality],
        scrollCount: scrollCount || 3,
        additionalKeywords: []
      });
      
      resolve(results);
    } catch (error) {
      console.error(`Error scraping locality ${locality}:`, error);
      resolve([]); // Return empty array on error
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 