# Google Maps Scraper

A GUI-based application for scraping business data from Google Maps with neighborhood cycling functionality.

## Features

- Search for businesses by type (e.g., dentists, restaurants, hotels)
- Cycle through multiple neighborhoods in Mumbai
- Extract comprehensive business data:
  - Name, category, address
  - Rating and number of reviews
  - Phone number and website
  - Operating hours
  - Geographic coordinates
- User-friendly GUI interface
- Export data to CSV or JSON formats

## Requirements

- Python 3.6+
- Required Python packages:
  - selenium
  - beautifulsoup4
  - webdriver-manager

## Installation

1. Clone or download this repository
2. Install the required dependencies:

```bash
pip install selenium beautifulsoup4 webdriver-manager
```

3. Run the application:

```bash
python main.py
```

## Usage

1. Enter the business type you want to search for (e.g., "dentists")
2. Select the neighborhoods in Mumbai you want to search
3. Click "Start Scraping" to begin the process
4. View results in the Results tab
5. Export data to CSV or JSON when complete

## Project Structure

- `main.py` - Main entry point for the application
- `google_maps_scraper.py` - Core scraper functionality
- `google_maps_scraper_gui.py` - GUI interface implementation
- `test_scraper.py` - Test script for core functionality

## Notes on Scraping

The application may encounter challenges when scraping Google Maps:

1. **Rate Limiting**: Google may limit the number of requests from a single IP address
2. **CAPTCHA Challenges**: Automated browsing may trigger CAPTCHA verification
3. **Structure Changes**: Google Maps' HTML structure may change, affecting extraction

If you encounter issues:
- Try running with headless mode disabled (in Settings tab)
- Reduce the number of neighborhoods searched at once
- Add delays between searches by modifying the code

## Legal Considerations

Web scraping may be against Google's Terms of Service. This tool is provided for educational purposes only. Use responsibly and at your own risk.

## Troubleshooting

If the application fails to find results:
1. Check your internet connection
2. Verify that Chrome and ChromeDriver are properly installed
3. Try disabling headless mode in the Settings tab
4. Check if Google Maps structure has changed, requiring code updates

## Future Improvements

- Add proxy support to avoid rate limiting
- Implement CAPTCHA solving capabilities
- Add more filtering options
- Support for other cities beyond Mumbai
