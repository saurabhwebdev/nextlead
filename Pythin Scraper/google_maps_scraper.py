#!/usr/bin/env python3
"""
Google Maps Scraper - Core Functionality
This module implements the core scraping functionality for extracting business data from Google Maps.
"""

import os
import time
import random
import json
import csv
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException
from bs4 import BeautifulSoup

class Business:
    """Class to represent a business entity extracted from Google Maps"""
    def __init__(self):
        self.name = ""              # Business name
        self.category = ""          # Business category
        self.address = ""           # Full address
        self.neighborhood = ""      # Neighborhood
        self.phone = ""             # Contact phone
        self.website = ""           # Website URL
        self.rating = 0.0           # Rating (0-5)
        self.reviews_count = 0      # Number of reviews
        self.hours = {}             # Operating hours
        self.latitude = 0.0         # Latitude coordinate
        self.longitude = 0.0        # Longitude coordinate
        self.place_id = ""          # Google Maps place ID
    
    def to_dict(self):
        """Convert business object to dictionary"""
        return {
            'name': self.name,
            'category': self.category,
            'address': self.address,
            'neighborhood': self.neighborhood,
            'phone': self.phone,
            'website': self.website,
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'hours': self.hours,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'place_id': self.place_id
        }
    
    def __str__(self):
        """String representation of business"""
        return f"{self.name} - {self.address} - Rating: {self.rating} ({self.reviews_count} reviews)"


class GoogleMapsScraper:
    """Main scraper class for extracting data from Google Maps"""
    
    def __init__(self, headless=True, chrome_driver_path=None):
        """Initialize the scraper with browser settings
        
        Args:
            headless (bool): Whether to run Chrome in headless mode
            chrome_driver_path (str): Path to Chrome driver executable
        """
        self.chrome_options = Options()
        if headless:
            self.chrome_options.add_argument("--headless")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("--enable-unsafe-swiftshader")
        
        # Use webdriver manager if no path provided
        if chrome_driver_path:
            self.service = Service(chrome_driver_path)
        else:
            try:
                from webdriver_manager.chrome import ChromeDriverManager
                self.service = Service(ChromeDriverManager().install())
            except ImportError:
                raise ImportError("Please install webdriver-manager package or provide chrome_driver_path")
        
        self.driver = None
        self.wait = None
        self.businesses = []
        self.neighborhoods = []
    
    def start_browser(self):
        """Start the Chrome browser"""
        if self.driver is not None:
            self.close_browser()
        
        self.driver = webdriver.Chrome(service=self.service, options=self.chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        return self.driver
    
    def close_browser(self):
        """Close the browser and clean up resources"""
        if self.driver is not None:
            self.driver.quit()
            self.driver = None
            self.wait = None
    
    def set_neighborhoods(self, neighborhoods):
        """Set the list of neighborhoods to scrape
        
        Args:
            neighborhoods (list): List of neighborhood names
        """
        self.neighborhoods = neighborhoods
    
    def search_google_maps(self, query):
        """Search Google Maps with the given query
        
        Args:
            query (str): Search query string
        
        Returns:
            bool: True if search was successful, False otherwise
        """
        try:
            if self.driver is None:
                self.start_browser()
            
            # Navigate to Google Maps
            self.driver.get("https://www.google.com/maps")
            
            # Wait for the search box to be available and enter the query
            search_box = self.wait.until(EC.presence_of_element_located((By.ID, "searchboxinput")))
            search_box.clear()
            search_box.send_keys(query)
            search_box.send_keys(Keys.ENTER)
            
            # Wait for results to load
            time.sleep(3)  # Initial wait
            
            # Check if we have search results
            try:
                self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div[role='feed']")))
                return True
            except TimeoutException:
                print(f"No results found for query: {query}")
                return False
                
        except Exception as e:
            print(f"Error during search: {str(e)}")
            return False
    
    def scroll_results(self, max_scrolls=10, scroll_pause_time=2):
        """Scroll through the results panel to load more results
        
        Args:
            max_scrolls (int): Maximum number of scrolls to perform
            scroll_pause_time (float): Time to pause between scrolls
        
        Returns:
            int: Number of results found
        """
        try:
            # Find the results panel
            results_panel = self.driver.find_element(By.CSS_SELECTOR, "div[role='feed']")
            
            # Scroll to load more results
            last_height = self.driver.execute_script("return arguments[0].scrollHeight", results_panel)
            
            for i in range(max_scrolls):
                # Scroll down
                self.driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight);", results_panel)
                
                # Wait for new results to load
                time.sleep(scroll_pause_time)
                
                # Calculate new scroll height and compare with last scroll height
                new_height = self.driver.execute_script("return arguments[0].scrollHeight", results_panel)
                
                # Break if no more new results
                if new_height == last_height:
                    break
                    
                last_height = new_height
                
                # Add some randomness to appear more human-like
                time.sleep(random.uniform(0.5, 1.5))
            
            # Count the number of results
            results = self.driver.find_elements(By.CSS_SELECTOR, "div[role='article']")
            return len(results)
            
        except Exception as e:
            print(f"Error during scrolling: {str(e)}")
            return 0
    
    def extract_business_listings(self):
        """Extract basic information from all visible business listings
        
        Returns:
            list: List of Business objects with basic information
        """
        businesses = []
        
        try:
            # Find all business listings
            listings = self.driver.find_elements(By.CSS_SELECTOR, "div[role='article']")
            
            for listing in listings:
                try:
                    business = Business()
                    
                    # Extract name
                    name_element = listing.find_element(By.CSS_SELECTOR, "div.fontHeadlineSmall")
                    business.name = name_element.text.strip()
                    
                    # Extract rating and reviews if available
                    try:
                        rating_element = listing.find_element(By.CSS_SELECTOR, "span.fontBodyMedium > span")
                        rating_text = rating_element.text.strip()
                        if rating_text:
                            business.rating = float(rating_text)
                        
                        reviews_element = listing.find_element(By.CSS_SELECTOR, "span.fontBodyMedium > span:nth-child(2)")
                        reviews_text = reviews_element.text.strip().replace('(', '').replace(')', '').replace(',', '')
                        if reviews_text.isdigit():
                            business.reviews_count = int(reviews_text)
                    except (NoSuchElementException, ValueError):
                        # Rating or reviews not available
                        pass
                    
                    # Extract category and address
                    try:
                        info_elements = listing.find_elements(By.CSS_SELECTOR, "div.fontBodyMedium")
                        if len(info_elements) >= 1:
                            business.category = info_elements[0].text.strip()
                        if len(info_elements) >= 2:
                            business.address = info_elements[1].text.strip()
                    except NoSuchElementException:
                        pass
                    
                    # Store the listing element reference for later detailed extraction
                    business.listing_element = listing
                    
                    businesses.append(business)
                    
                except Exception as e:
                    print(f"Error extracting business listing: {str(e)}")
                    continue
            
            return businesses
            
        except Exception as e:
            print(f"Error extracting business listings: {str(e)}")
            return []
    
    def extract_business_details(self, business):
        """Extract detailed information for a business by clicking on its listing
        
        Args:
            business (Business): Business object with listing_element attribute
        
        Returns:
            Business: Updated business object with detailed information
        """
        try:
            # Click on the listing to open details panel
            try:
                business.listing_element.click()
            except ElementClickInterceptedException:
                # Try JavaScript click if normal click is intercepted
                self.driver.execute_script("arguments[0].click();", business.listing_element)
            
            # Wait for details panel to load
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.m6QErb.tLjsW")))
            time.sleep(2)  # Additional wait for all content to load
            
            # Extract phone number
            try:
                phone_button = self.driver.find_element(By.CSS_SELECTOR, "button[data-item-id='phone:tel']")
                business.phone = phone_button.get_attribute("data-item-id").replace("phone:tel:", "")
            except NoSuchElementException:
                pass
            
            # Extract website
            try:
                website_button = self.driver.find_element(By.CSS_SELECTOR, "a[data-item-id^='authority']")
                business.website = website_button.get_attribute("href")
            except NoSuchElementException:
                pass
            
            # Extract hours
            try:
                hours_section = self.driver.find_element(By.CSS_SELECTOR, "div[aria-label^='Hours'] table")
                days = hours_section.find_elements(By.CSS_SELECTOR, "tr")
                
                for day in days:
                    day_cells = day.find_elements(By.CSS_SELECTOR, "td")
                    if len(day_cells) >= 2:
                        day_name = day_cells[0].text.strip()
                        day_hours = day_cells[1].text.strip()
                        business.hours[day_name] = day_hours
            except NoSuchElementException:
                pass
            
            # Extract coordinates from URL
            try:
                url = self.driver.current_url
                if "@" in url:
                    coords_part = url.split("@")[1].split(",")
                    if len(coords_part) >= 2:
                        business.latitude = float(coords_part[0])
                        business.longitude = float(coords_part[1])
            except (IndexError, ValueError):
                pass
            
            # Extract place ID from URL
            try:
                url = self.driver.current_url
                if "place/" in url:
                    place_part = url.split("place/")[1].split("/")[0]
                    business.place_id = place_part
            except IndexError:
                pass
            
            # Go back to results list
            back_button = self.driver.find_element(By.CSS_SELECTOR, "button[aria-label='Back']")
            back_button.click()
            time.sleep(1)  # Wait for results to reload
            
            return business
            
        except Exception as e:
            print(f"Error extracting business details: {str(e)}")
            return business
    
    def scrape_neighborhood(self, business_type, neighborhood):
        """Scrape businesses of a specific type in a neighborhood
        
        Args:
            business_type (str): Type of business to search for
            neighborhood (str): Neighborhood name
        
        Returns:
            list: List of Business objects with detailed information
        """
        neighborhood_businesses = []
        
        # Construct search query
        query = f"{business_type} in {neighborhood} Mumbai"
        print(f"Searching for: {query}")
        
        # Search Google Maps
        if not self.search_google_maps(query):
            return []
        
        # Scroll to load more results
        num_results = self.scroll_results()
        print(f"Found {num_results} results")
        
        # Extract basic information from listings
        businesses = self.extract_business_listings()
        
        # Extract detailed information for each business
        for business in businesses:
            business.neighborhood = neighborhood
            detailed_business = self.extract_business_details(business)
            neighborhood_businesses.append(detailed_business)
            
            # Add random delay between requests
            time.sleep(random.uniform(1, 3))
        
        return neighborhood_businesses
    
    def scrape_all_neighborhoods(self, business_type):
        """Scrape businesses of a specific type across all neighborhoods
        
        Args:
            business_type (str): Type of business to search for
        
        Returns:
            list: List of all Business objects across all neighborhoods
        """
        all_businesses = []
        
        for neighborhood in self.neighborhoods:
            try:
                print(f"\nScraping {business_type} in {neighborhood}...")
                neighborhood_businesses = self.scrape_neighborhood(business_type, neighborhood)
                all_businesses.extend(neighborhood_businesses)
                print(f"Found {len(neighborhood_businesses)} businesses in {neighborhood}")
                
                # Add delay between neighborhoods to avoid rate limiting
                time.sleep(random.uniform(3, 5))
                
            except Exception as e:
                print(f"Error scraping {neighborhood}: {str(e)}")
                continue
        
        self.businesses = all_businesses
        return all_businesses
    
    def export_to_csv(self, filename=None):
        """Export scraped businesses to CSV file
        
        Args:
            filename (str, optional): Output filename. Defaults to 'google_maps_data_YYYY-MM-DD.csv'.
        
        Returns:
            str: Path to the exported CSV file
        """
        if not self.businesses:
            print("No businesses to export")
            return None
        
        if filename is None:
            date_str = datetime.now().strftime("%Y-%m-%d")
            filename = f"google_maps_data_{date_str}.csv"
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                # Determine all possible hours fields
                all_days = set()
                for business in self.businesses:
                    all_days.update(business.hours.keys())
                
                # Create fieldnames including all possible days
                fieldnames = [
                    'name', 'category', 'address', 'neighborhood', 'phone', 
                    'website', 'rating', 'reviews_count', 'latitude', 'longitude', 'place_id'
                ]
                for day in sorted(all_days):
                    fieldnames.append(f'hours_{day}')
                
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for business in self.businesses:
                    # Create a flat dictionary with hours
                    business_dict = business.to_dict()
                    flat_dict = {
                        'name': business_dict['name'],
                        'category': business_dict['category'],
                        'address': business_dict['address'],
                        'neighborhood': business_dict['neighborhood'],
                        'phone': business_dict['phone'],
                        'website': business_dict['website'],
                        'rating': business_dict['rating'],
                        'reviews_count': business_dict['reviews_count'],
                        'latitude': business_dict['latitude'],
                        'longitude': business_dict['longitude'],
                        'place_id': business_dict['place_id']
                    }
                    
                    # Add hours
                    for day, hours in business_dict['hours'].items():
                        flat_dict[f'hours_{day}'] = hours
                    
                    writer.writerow(flat_dict)
            
            print(f"Exported {len(self.businesses)} businesses to {filename}")
            return filename
            
        except Exception as e:
            print(f"Error exporting to CSV: {str(e)}")
            return None
    
    def export_to_json(self, filename=None):
        """Export scraped businesses to JSON file
        
        Args:
            filename (str, optional): Output filename. Defaults to 'google_maps_data_YYYY-MM-DD.json'.
        
        Returns:
            str: Path to the exported JSON file
        """
        if not self.businesses:
            print("No businesses to export")
            return None
        
        if filename is None:
            date_str = datetime.now().strftime("%Y-%m-%d")
            filename = f"google_maps_data_{date_str}.json"
        
        try:
            businesses_data = [business.to_dict() for business in self.businesses]
            
            with open(filename, 'w', encoding='utf-8') as jsonfile:
                json.dump(businesses_data, jsonfile, indent=2, ensure_ascii=False)
            
            print(f"Exported {len(self.businesses)} businesses to {filename}")
            return filename
            
        except Exception as e:
            print(f"Error exporting to JSON: {str(e)}")
            return None


# Example usage
if __name__ == "__main__":
    # Define Mumbai neighborhoods
    mumbai_neighborhoods = [
        "Bandra", "Andheri", "Juhu", "Colaba", "Worli", 
        "Dadar", "Powai", "Chembur", "Malad", "Borivali"
    ]
    
    # Initialize scraper
    scraper = GoogleMapsScraper(headless=False)
    scraper.set_neighborhoods(mumbai_neighborhoods)
    
    try:
        # Start browser
        scraper.start_browser()
        
        # Scrape dentists across all neighborhoods
        businesses = scraper.scrape_all_neighborhoods("dentists")
        
        # Export results
        scraper.export_to_csv()
        scraper.export_to_json()
        
    finally:
        # Clean up
        scraper.close_browser()
