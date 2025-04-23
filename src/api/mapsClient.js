import axios from 'axios';

const API_URL = 'http://localhost:3001';

/**
 * Fetch business data from Google Maps based on search criteria
 * @param {Object} params Search parameters
 * @param {string} params.businessType The main business category
 * @param {string} params.subcategory The specific business subcategory
 * @param {string} params.location The city/location
 * @param {Array<string>} params.selectedLocalities Array of locality IDs
 * @param {string} [params.additionalKeywords] Optional additional search terms
 * @param {number} [params.scrollCount=5] Number of scrolls to perform (default 5)
 * @param {Function} [params.onProgress] Optional callback for progress updates: (progress, count, area) => void
 * @returns {Promise<Object>} The API response
 */
export const scrapeGoogleMaps = async (params) => {
  const { onProgress, ...apiParams } = params;
  
  try {
    // For long-running scrapes, use EventSource to get progress updates
    if (params.scrollCount > 5 && onProgress) {
      return new Promise((resolve, reject) => {
        let foundCount = 0;
        let currentProgress = 0;
        let currentArea = '';
        
        // Initialize the request
        axios.post(`${API_URL}/api/scrape/init`, apiParams)
          .then(response => {
            const { sessionId } = response.data;
            
            // Use EventSource to get progress updates
            const eventSource = new EventSource(`${API_URL}/api/scrape/progress/${sessionId}`);
            
            eventSource.onmessage = (event) => {
              const data = JSON.parse(event.data);
              
              if (data.progress) {
                currentProgress = Math.min(95, data.progress);
                if (data.count) foundCount = data.count;
                if (data.area) currentArea = data.area;
                
                onProgress(currentProgress, foundCount, currentArea);
              }
              
              // When complete, clean up and resolve
              if (data.complete) {
                eventSource.close();
                resolve(data.results);
              }
            };
            
            eventSource.onerror = () => {
              eventSource.close();
              reject(new Error('Connection to scraper lost'));
            };
          })
          .catch(error => {
            reject(error);
          });
      });
    }
    
    // For regular scrapes, use standard API call
    const response = await axios.post(`${API_URL}/api/scrape`, apiParams);
    
    // If onProgress is provided, report real progress
    if (onProgress) {
      // First progress update at 20%
      onProgress(20, 0, params.selectedLocalities[0]);
      
      // Further progress updates with actual data from API
      if (response.data.results) {
        onProgress(80, response.data.results.length, 
          params.selectedLocalities[
            Math.min(params.selectedLocalities.length - 1, 1)
          ]);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error scraping Google Maps:', error);
    throw error;
  }
}; 