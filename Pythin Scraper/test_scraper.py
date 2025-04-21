#!/usr/bin/env python3
"""
Google Maps Scraper - Test Script
This script tests the core functionality of the Google Maps Scraper.
"""

import os
import sys
import time
from google_maps_scraper import GoogleMapsScraper

def test_single_neighborhood():
    """Test scraping a single neighborhood"""
    print("=== Testing Single Neighborhood Scraping ===")
    
    # Initialize scraper
    scraper = GoogleMapsScraper(headless=True)
    
    try:
        # Start browser
        print("Starting browser...")
        scraper.start_browser()
        
        # Test search functionality
        print("Testing search functionality...")
        query = "dentists in Bandra Mumbai"
        success = scraper.search_google_maps(query)
        print(f"Search success: {success}")
        
        if success:
            # Test scrolling
            print("Testing scrolling functionality...")
            num_results = scraper.scroll_results(max_scrolls=3)
            print(f"Found {num_results} results after scrolling")
            
            # Test extraction
            print("Testing extraction functionality...")
            businesses = scraper.extract_business_listings()
            print(f"Extracted {len(businesses)} business listings")
            
            # Print first business details
            if businesses:
                print("\nSample business data:")
                print(f"Name: {businesses[0].name}")
                print(f"Category: {businesses[0].category}")
                print(f"Address: {businesses[0].address}")
                print(f"Rating: {businesses[0].rating}")
                print(f"Reviews: {businesses[0].reviews_count}")
        
    except Exception as e:
        print(f"Error during testing: {str(e)}")
    
    finally:
        # Clean up
        print("\nClosing browser...")
        scraper.close_browser()

def test_neighborhood_cycling():
    """Test cycling through multiple neighborhoods"""
    print("\n=== Testing Neighborhood Cycling ===")
    
    # Initialize scraper
    scraper = GoogleMapsScraper(headless=True)
    
    # Set neighborhoods
    neighborhoods = ["Bandra", "Andheri"]
    scraper.set_neighborhoods(neighborhoods)
    
    try:
        # Start browser
        print("Starting browser...")
        scraper.start_browser()
        
        # Test neighborhood cycling
        print("Testing neighborhood cycling...")
        all_businesses = []
        
        for neighborhood in neighborhoods:
            print(f"\nScraping in {neighborhood}...")
            businesses = scraper.scrape_neighborhood("dentists", neighborhood)
            all_businesses.extend(businesses)
            print(f"Found {len(businesses)} businesses in {neighborhood}")
        
        print(f"\nTotal businesses found: {len(all_businesses)}")
        
        # Test export functionality
        if all_businesses:
            scraper.businesses = all_businesses
            
            print("\nTesting CSV export...")
            csv_file = scraper.export_to_csv("test_export.csv")
            print(f"CSV export: {csv_file}")
            
            print("Testing JSON export...")
            json_file = scraper.export_to_json("test_export.json")
            print(f"JSON export: {json_file}")
        
    except Exception as e:
        print(f"Error during testing: {str(e)}")
    
    finally:
        # Clean up
        print("\nClosing browser...")
        scraper.close_browser()

if __name__ == "__main__":
    # Run tests
    test_single_neighborhood()
    test_neighborhood_cycling()
    
    print("\n=== Testing Complete ===")
