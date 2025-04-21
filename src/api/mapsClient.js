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
 * @returns {Promise<Object>} The API response
 */
export const scrapeGoogleMaps = async (params) => {
  try {
    const response = await axios.post(`${API_URL}/api/scrape`, params);
    return response.data;
  } catch (error) {
    console.error('Error scraping Google Maps:', error);
    throw error;
  }
};

// Mock data for development/testing
export const getMockResults = () => {
  return {
    success: true,
    results: [
      {
        title: 'Bandra Dental Clinic',
        rating: '4.5',
        reviews: '125',
        type: 'Dentist',
        address: '123 Hill Road, Bandra West, Mumbai, Maharashtra 400050',
        openState: 'Open ⋅ Closes 8PM',
        phone: '+91 22 2642 1234',
        website: 'https://example.com/bandra-dental',
        description: 'Family dental practice offering comprehensive dental care',
        serviceOptions: 'On-site parking ⋅ Wheelchair accessible',
        coordinates: { latitude: '19.0596', longitude: '72.8295' },
        thumbnail: 'https://via.placeholder.com/150',
        searchQuery: 'dentist bandra mumbai'
      },
      {
        title: 'SmileCare Dental Center',
        rating: '4.2',
        reviews: '89',
        type: 'Dentist',
        address: '45 Turner Road, Bandra West, Mumbai, Maharashtra 400050',
        openState: 'Open ⋅ Closes 7PM',
        phone: '+91 22 2648 5678',
        website: 'https://example.com/smilecare',
        description: 'Modern dental clinic specializing in cosmetic dentistry',
        serviceOptions: 'Appointment required ⋅ Masks required',
        coordinates: { latitude: '19.0612', longitude: '72.8302' },
        thumbnail: 'https://via.placeholder.com/150',
        searchQuery: 'dentist bandra mumbai'
      },
      {
        title: 'Juhu Dental Specialists',
        rating: '4.7',
        reviews: '203',
        type: 'Dentist',
        address: '78 Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049',
        openState: 'Closed ⋅ Opens 9AM tomorrow',
        phone: '+91 22 2620 9876',
        website: 'https://example.com/juhu-dental',
        description: 'Premium dental care for all ages',
        serviceOptions: 'By appointment only ⋅ Private parking',
        coordinates: { latitude: '19.0883', longitude: '72.8258' },
        thumbnail: 'https://via.placeholder.com/150',
        searchQuery: 'dentist juhu mumbai'
      }
    ]
  };
}; 