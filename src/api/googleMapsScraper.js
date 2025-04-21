import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

/**
 * Scrapes Google Maps for business information based on search criteria
 * @param {Object} params Search parameters
 * @param {string} params.query The business type/category to search for
 * @param {string} params.location The city/location to search in
 * @param {Array<string>} params.localities Array of specific localities/neighborhoods
 * @param {string} [params.additionalKeywords] Optional additional search terms
 * @param {number} [params.scrollCount=5] Number of times to scroll (default 5)
 * @returns {Promise<Array>} Array of business data
 */
export default async function scrapeGoogleMaps(params) {
  const { 
    query, 
    location, 
    localities, 
    additionalKeywords = '',
    scrollCount = 5 
  } = params;
  
  // Validate required parameters
  if (!query || !location || !localities || localities.length === 0) {
    throw new Error('Missing required search parameters');
  }

  // Format the search query
  const searchQueries = localities.map(locality => {
    const searchTerms = [query, locality, location];
    if (additionalKeywords) searchTerms.push(additionalKeywords);
    return searchTerms.join(' ');
  });

  const allResults = [];

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--lang=en-US,en',
      '--disable-blink-features=AutomationControlled'
    ],
  });

  try {
    // Process each locality search
    for (const searchQuery of searchQueries) {
      const page = await browser.newPage();
      
      // Set a reasonable viewport
      await page.setViewport({ width: 1280, height: 800 });
      
      // Set proper encoding and headers to avoid encoding issues
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Charset': 'utf-8'
      });
      
      // Configure proper encoding
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {
          get: function() {
            return ['en-US', 'en'];
          },
        });
      });
      
      // Navigate to Google Maps with the search query
      const encodedQuery = encodeURIComponent(searchQuery);
      const URL = `https://www.google.com/maps/search/${encodedQuery}`;
      
      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Wait for search results to load
      await page.waitForSelector('.bfdHYd', { timeout: 10000 }).catch(() => {
        console.log(`No results found for query: ${searchQuery}`);
        return [];
      });

      // Scroll to load more results
      await scrollPage(page, scrollCount);

      // Extract data from the page
      const results = await extractBusinessData(page, searchQuery);
      allResults.push(...results);

      await page.close();
    }
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }

  // Remove duplicates based on place name and address
  const uniqueResults = removeDuplicates(allResults);
  
  return uniqueResults;
}

/**
 * Scroll down the Google Maps results page to load more results
 * @param {Page} page Puppeteer page object
 * @param {number} scrollCount Number of times to scroll
 */
async function scrollPage(page, scrollCount = 5) {
  try {
    const scrollContainer = '.m6QErb[aria-label]';
    
    // Check if the scrollable container exists
    const containerExists = await page.evaluate((selector) => {
      return !!document.querySelector(selector);
    }, scrollContainer);
    
    if (!containerExists) {
      console.log('Scroll container not found');
      return;
    }

    let lastHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
    let scrollAttempts = 0;
    
    // Use a more reasonable max count (user defined or default to 5)
    const maxScrolls = scrollCount;

    while (scrollAttempts < maxScrolls) {
      // Scroll to bottom of container
      await page.evaluate(`document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`);
      
      // Use page.evaluate with setTimeout instead of waitForTimeout
      await page.evaluate(() => {
        return new Promise(resolve => setTimeout(resolve, 2000));
      });
      
      const newHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
      if (newHeight === lastHeight) {
        // No more new content, break the loop
        break;
      }
      
      lastHeight = newHeight;
      scrollAttempts++;
    }
  } catch (error) {
    console.error('Error during scrolling:', error);
  }
}

/**
 * Sanitize text by removing non-printable and special characters
 * @param {string} text The text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
  if (!text) return '';
  
  // Replace common encoding artifacts and normalize unicode
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/î‚°|î‚¯|îƒˆ|î|ƒˆ|‚°/, '') // Remove specific symbols seen in the address and phone
    .replace(/â‹…|â€¯/, '') // Remove specific symbols seen in opening hours
    .replace(/[^\x20-\x7E\s,.]/g, '') // Remove non-ASCII chars but keep punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Sanitize a phone number
 * @param {string} phone The phone number to sanitize
 * @returns {string} Sanitized phone number
 */
function sanitizePhone(phone) {
  if (!phone) return '';
  
  // Remove the special prefix "î‚°" or similar and keep only valid phone characters
  return phone
    .normalize('NFD')
    .replace(/î‚°|î‚¯|îƒˆ|î|ƒˆ|‚°/, '') // Remove the specific prefix
    .replace(/[^\d+\s\-()]/g, '')      // Keep only valid phone characters
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .trim();
}

/**
 * Sanitize opening hours text
 * @param {string} hours The opening hours text to sanitize
 * @returns {string} Sanitized opening hours
 */
function sanitizeOpeningHours(hours) {
  if (!hours) return '';
  
  return hours
    .normalize('NFD')
    .replace(/â‹…|â€¯/g, ' ') // Replace problematic chars with spaces
    .replace(/Opens/i, 'Opens ')
    .replace(/Closes/i, 'Closes ')
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

/**
 * Extract business data from the Google Maps results page
 * @param {Page} page Puppeteer page object
 * @param {string} searchQuery The search query used
 * @returns {Promise<Array>} Array of business data
 */
async function extractBusinessData(page, searchQuery) {
  try {
    // Improved approach: Click on each result to load more details and extract data better
    const resultItems = await page.$$('.bfdHYd');
    const results = [];
    
    // Process each item one by one
    for (let i = 0; i < Math.min(resultItems.length, 20); i++) {
      try {
        // Click on each item to open the detailed view
        await resultItems[i].click();
        
        // Wait for the detailed info to load
        await page.evaluate(() => {
          return new Promise(resolve => setTimeout(resolve, 1500));
        });
        
        // Check if we're in the detailed view by looking for phone and website elements
        const isDetailedView = await page.evaluate(() => {
          return !!document.querySelector('.rogA2c') || !!document.querySelector('.ITvuef');
        });
        
        if (isDetailedView) {
          // Set document charset to ensure proper text extraction
          await page.evaluate(() => {
            // Force UTF-8 encoding if possible
            const meta = document.createElement('meta');
            meta.setAttribute('charset', 'UTF-8');
            document.head.appendChild(meta);
          });
          
          // Extract detailed information from the panel
          const businessData = await page.evaluate(() => {
            // Core business information
            const title = document.querySelector('h1.DUwDvf')?.textContent.trim() || '';
            const rating = document.querySelector('.F7nice span')?.textContent.trim() || '';
            const reviewsText = document.querySelector('.F7nice span:nth-child(2)')?.textContent.trim() || '';
            const reviews = reviewsText.replace(/[()]/g, '');
            
            // Type and address
            const address = document.querySelector('button[data-item-id="address"]')?.textContent.trim() || 
                           document.querySelector('button[data-tooltip="Copy address"]')?.textContent.trim() || '';
            
            const typeElement = document.querySelector('.DkEaL');
            const type = typeElement ? typeElement.textContent.trim() : '';
            
            // Opening hours
            const openStateElement = document.querySelector('.ZDu9vd');
            const openState = openStateElement ? openStateElement.textContent.trim() : '';
            
            // Phone number - multiple possible locations
            let phone = '';
            const phoneButton = document.querySelector('button[data-item-id="phone:tel"]') || 
                              document.querySelector('[data-tooltip="Copy phone number"]') ||
                              document.querySelector('button[aria-label*="phone"]');
            
            if (phoneButton) {
              phone = phoneButton.textContent.trim();
            }
            
            // Fallback phone number extraction
            if (!phone) {
              const phoneElements = document.querySelectorAll('.rogA2c');
              for (const el of phoneElements) {
                const text = el.textContent.trim();
                if (/^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(text)) {
                  phone = text;
                  break;
                }
              }
            }
            
            // Website
            let website = '';
            const websiteLink = document.querySelector('a[data-item-id="authority"]') || 
                               document.querySelector('a[href^="https://"][data-track-element="url"]') ||
                               document.querySelector('a[data-tooltip="Open website"]');
            
            if (websiteLink) {
              website = websiteLink.href || '';
            }
            
            // Description and services
            const description = document.querySelector('.PYvSYb')?.textContent.trim() || '';
            
            // Service options
            const serviceOptionsElement = document.querySelector('.qty3Ue');
            const serviceOptions = serviceOptionsElement ? serviceOptionsElement.textContent.trim() : '';
            
            // Image
            const thumbnailElement = document.querySelector('.RZ66Rb img');
            const thumbnail = thumbnailElement ? thumbnailElement.src : '';
            
            // Coordinates 
            // Try to extract from URL first
            let latitude = null, longitude = null;
            try {
              const mapUrl = document.querySelector('a[href^="https://www.google.com/maps/dir"]')?.href || '';
              const urlPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
              const match = urlPattern.exec(mapUrl);
              if (match) {
                latitude = match[1];
                longitude = match[2];
              }
            } catch (err) {
              console.error('Error extracting coordinates:', err);
            }
            
            return {
              title,
              rating,
              reviews,
              type,
              address,
              openState,
              phone,
              website,
              description,
              serviceOptions,
              coordinates: latitude && longitude ? { latitude, longitude } : null,
              thumbnail
            };
          });
          
          // Sanitize the extracted data to fix encoding issues
          businessData.title = sanitizeText(businessData.title);
          businessData.address = sanitizeText(businessData.address);
          businessData.phone = sanitizePhone(businessData.phone);
          businessData.openState = sanitizeOpeningHours(businessData.openState);
          businessData.type = sanitizeText(businessData.type);
          businessData.description = sanitizeText(businessData.description);
          businessData.serviceOptions = sanitizeText(businessData.serviceOptions);
          
          // Only add business with complete data
          if (businessData.title) {
            businessData.searchQuery = searchQuery;
            results.push(businessData);
          }
          
          // Go back to results list
          await page.evaluate(() => {
            const backButton = document.querySelector('button[jsaction*="back"]') || 
                               document.querySelector('button.hYBOP');
            if (backButton) backButton.click();
          });
          
          // Wait for the results list to become active again
          await page.evaluate(() => {
            return new Promise(resolve => setTimeout(resolve, 1000));
          });
        }
      } catch (err) {
        console.error('Error processing result item:', err);
        // Continue with next item even if there's an error
        continue;
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error extracting business data:', error);
    return [];
  }
}

/**
 * Remove duplicate business entries based on name and address
 * @param {Array} results Array of business data
 * @returns {Array} Deduplicated array
 */
function removeDuplicates(results) {
  const seen = new Set();
  
  return results.filter(item => {
    const key = `${item.title}|${item.address}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
} 