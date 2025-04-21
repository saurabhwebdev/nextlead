#!/usr/bin/env python3
"""
Google Maps Scraper - Main Application
This is the main entry point for the Google Maps Scraper application.
"""

import os
import sys
import tkinter as tk
from google_maps_scraper_gui import GoogleMapsScraperGUI

def main():
    """Main entry point for the application"""
    # Create the root window
    root = tk.Tk()
    
    # Set application title
    root.title("Google Maps Scraper")
    
    # Create the GUI application
    app = GoogleMapsScraperGUI(root)
    
    # Start the main event loop
    root.mainloop()

if __name__ == "__main__":
    main()
