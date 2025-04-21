#!/usr/bin/env python3
"""
Google Maps Scraper - GUI Interface
This module implements the GUI interface for the Google Maps Scraper.
"""

import os
import sys
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from datetime import datetime
import json

# Import the core scraper functionality
from google_maps_scraper import GoogleMapsScraper, Business

class GoogleMapsScraperGUI:
    """GUI interface for the Google Maps Scraper"""
    
    def __init__(self, root):
        """Initialize the GUI
        
        Args:
            root (tk.Tk): Root Tkinter window
        """
        self.root = root
        self.root.title("Google Maps Scraper")
        self.root.geometry("900x700")
        self.root.minsize(800, 600)
        
        # Set icon if available
        try:
            self.root.iconbitmap("icon.ico")
        except:
            pass
        
        # Initialize scraper
        self.scraper = GoogleMapsScraper(headless=True)
        
        # Default neighborhoods in Mumbai
        self.default_neighborhoods = [
            "Bandra", "Andheri", "Juhu", "Colaba", "Worli", 
            "Dadar", "Powai", "Chembur", "Malad", "Borivali"
        ]
        
        # Initialize variables
        self.search_query = tk.StringVar()
        self.export_format = tk.StringVar(value="csv")
        self.max_results = tk.IntVar(value=50)
        self.headless_mode = tk.BooleanVar(value=True)
        self.selected_neighborhoods = {}
        for neighborhood in self.default_neighborhoods:
            self.selected_neighborhoods[neighborhood] = tk.BooleanVar(value=True)
        
        # Custom neighborhoods
        self.custom_neighborhoods = []
        
        # Scraping status
        self.is_scraping = False
        self.scraping_thread = None
        
        # Create GUI elements
        self.create_widgets()
        
        # Center the window
        self.center_window()
    
    def center_window(self):
        """Center the window on the screen"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f"{width}x{height}+{x}+{y}")
    
    def create_widgets(self):
        """Create all GUI widgets"""
        # Create main frame with padding
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create a notebook (tabbed interface)
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Create tabs
        search_tab = ttk.Frame(notebook)
        results_tab = ttk.Frame(notebook)
        settings_tab = ttk.Frame(notebook)
        
        notebook.add(search_tab, text="Search")
        notebook.add(results_tab, text="Results")
        notebook.add(settings_tab, text="Settings")
        
        # ===== Search Tab =====
        self.create_search_tab(search_tab)
        
        # ===== Results Tab =====
        self.create_results_tab(results_tab)
        
        # ===== Settings Tab =====
        self.create_settings_tab(settings_tab)
        
        # Status bar at the bottom
        status_frame = ttk.Frame(main_frame)
        status_frame.pack(fill=tk.X, pady=(5, 0))
        
        self.status_label = ttk.Label(status_frame, text="Ready", anchor=tk.W)
        self.status_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        self.progress_bar = ttk.Progressbar(status_frame, mode="indeterminate", length=200)
        self.progress_bar.pack(side=tk.RIGHT, padx=(10, 0))
    
    def create_search_tab(self, parent):
        """Create the search tab widgets
        
        Args:
            parent (ttk.Frame): Parent frame
        """
        # Search frame
        search_frame = ttk.LabelFrame(parent, text="Search Parameters", padding="10")
        search_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Search query
        ttk.Label(search_frame, text="Business Type:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Entry(search_frame, textvariable=self.search_query, width=30).grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
        ttk.Label(search_frame, text="(e.g., dentists, restaurants, hotels)").grid(row=0, column=2, sticky=tk.W, pady=5)
        
        # Neighborhoods frame
        neighborhoods_frame = ttk.LabelFrame(parent, text="Mumbai Neighborhoods", padding="10")
        neighborhoods_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Create a canvas with scrollbar for neighborhoods
        canvas = tk.Canvas(neighborhoods_frame)
        scrollbar = ttk.Scrollbar(neighborhoods_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Add neighborhoods checkboxes
        for i, neighborhood in enumerate(self.default_neighborhoods):
            row = i // 3
            col = i % 3
            ttk.Checkbutton(
                scrollable_frame, 
                text=neighborhood,
                variable=self.selected_neighborhoods[neighborhood]
            ).grid(row=row, column=col, sticky=tk.W, padx=10, pady=2)
        
        # Add custom neighborhood section
        custom_frame = ttk.LabelFrame(scrollable_frame, text="Add Custom Neighborhood", padding="5")
        custom_frame.grid(row=(len(self.default_neighborhoods) // 3) + 1, column=0, columnspan=3, sticky=tk.EW, pady=10)
        
        self.custom_neighborhood_entry = ttk.Entry(custom_frame, width=20)
        self.custom_neighborhood_entry.grid(row=0, column=0, padx=5, pady=5)
        
        ttk.Button(
            custom_frame, 
            text="Add",
            command=self.add_custom_neighborhood
        ).grid(row=0, column=1, padx=5, pady=5)
        
        # Control buttons
        control_frame = ttk.Frame(parent)
        control_frame.pack(fill=tk.X, padx=5, pady=10)
        
        self.start_button = ttk.Button(
            control_frame, 
            text="Start Scraping",
            command=self.start_scraping
        )
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.stop_button = ttk.Button(
            control_frame, 
            text="Stop",
            command=self.stop_scraping,
            state=tk.DISABLED
        )
        self.stop_button.pack(side=tk.LEFT, padx=5)
        
        export_frame = ttk.Frame(control_frame)
        export_frame.pack(side=tk.RIGHT)
        
        ttk.Label(export_frame, text="Export as:").pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(export_frame, text="CSV", variable=self.export_format, value="csv").pack(side=tk.LEFT)
        ttk.Radiobutton(export_frame, text="JSON", variable=self.export_format, value="json").pack(side=tk.LEFT)
        
        self.export_button = ttk.Button(
            export_frame, 
            text="Export Results",
            command=self.export_results,
            state=tk.DISABLED
        )
        self.export_button.pack(side=tk.LEFT, padx=5)
    
    def create_results_tab(self, parent):
        """Create the results tab widgets
        
        Args:
            parent (ttk.Frame): Parent frame
        """
        # Results frame
        results_frame = ttk.Frame(parent, padding="10")
        results_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create treeview for results
        columns = (
            "name", "category", "address", "neighborhood", 
            "rating", "reviews", "phone"
        )
        
        self.results_tree = ttk.Treeview(results_frame, columns=columns, show="headings")
        
        # Define headings
        self.results_tree.heading("name", text="Name")
        self.results_tree.heading("category", text="Category")
        self.results_tree.heading("address", text="Address")
        self.results_tree.heading("neighborhood", text="Neighborhood")
        self.results_tree.heading("rating", text="Rating")
        self.results_tree.heading("reviews", text="Reviews")
        self.results_tree.heading("phone", text="Phone")
        
        # Define columns
        self.results_tree.column("name", width=150)
        self.results_tree.column("category", width=100)
        self.results_tree.column("address", width=200)
        self.results_tree.column("neighborhood", width=100)
        self.results_tree.column("rating", width=50)
        self.results_tree.column("reviews", width=70)
        self.results_tree.column("phone", width=120)
        
        # Add scrollbars
        vsb = ttk.Scrollbar(results_frame, orient="vertical", command=self.results_tree.yview)
        hsb = ttk.Scrollbar(results_frame, orient="horizontal", command=self.results_tree.xview)
        self.results_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        # Grid layout
        self.results_tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        
        results_frame.grid_rowconfigure(0, weight=1)
        results_frame.grid_columnconfigure(0, weight=1)
        
        # Details frame
        details_frame = ttk.LabelFrame(parent, text="Business Details", padding="10")
        details_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Text widget for details
        self.details_text = tk.Text(details_frame, height=10, wrap=tk.WORD)
        self.details_text.pack(fill=tk.BOTH, expand=True)
        self.details_text.config(state=tk.DISABLED)
        
        # Bind selection event
        self.results_tree.bind("<<TreeviewSelect>>", self.show_business_details)
    
    def create_settings_tab(self, parent):
        """Create the settings tab widgets
        
        Args:
            parent (ttk.Frame): Parent frame
        """
        # Settings frame
        settings_frame = ttk.LabelFrame(parent, text="Scraper Settings", padding="10")
        settings_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # Max results
        ttk.Label(settings_frame, text="Maximum results per neighborhood:").grid(row=0, column=0, sticky=tk.W, pady=5)
        ttk.Spinbox(
            settings_frame, 
            from_=10, 
            to=100, 
            increment=10,
            textvariable=self.max_results,
            width=5
        ).grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
        
        # Headless mode
        ttk.Checkbutton(
            settings_frame, 
            text="Run in headless mode (no visible browser)",
            variable=self.headless_mode
        ).grid(row=1, column=0, columnspan=2, sticky=tk.W, pady=5)
        
        # About frame
        about_frame = ttk.LabelFrame(parent, text="About", padding="10")
        about_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        about_text = """Google Maps Scraper

This application allows you to scrape business data from Google Maps across multiple neighborhoods in Mumbai.

Features:
- Search for businesses by type (e.g., dentists, restaurants)
- Select specific neighborhoods to scrape
- Export results to CSV or JSON format
- View detailed business information

Note: Web scraping may be against Google's Terms of Service. Use responsibly and for educational purposes only.
"""
        
        about_label = ttk.Label(about_frame, text=about_text, wraplength=600, justify=tk.LEFT)
        about_label.pack(padx=10, pady=10)
    
    def add_custom_neighborhood(self):
        """Add a custom neighborhood to the list"""
        neighborhood = self.custom_neighborhood_entry.get().strip()
        if not neighborhood:
            messagebox.showwarning("Warning", "Please enter a neighborhood name")
            return
        
        if neighborhood in self.selected_neighborhoods:
            messagebox.showwarning("Warning", f"Neighborhood '{neighborhood}' already exists")
            return
        
        # Add to the list
        self.selected_neighborhoods[neighborhood] = tk.BooleanVar(value=True)
        self.custom_neighborhoods.append(neighborhood)
        
        # Update the UI
        scrollable_frame = self.custom_neighborhood_entry.master.master
        row = (len(self.default_neighborhoods) + len(self.custom_neighborhoods) - 1) // 3
        col = (len(self.default_neighborhoods) + len(self.custom_neighborhoods) - 1) % 3
        
        ttk.Checkbutton(
            scrollable_frame, 
            text=neighborhood,
            variable=self.selected_neighborhoods[neighborhood]
        ).grid(row=row, column=col, sticky=tk.W, padx=10, pady=2)
        
        # Clear the entry
        self.custom_neighborhood_entry.delete(0, tk.END)
        
        messagebox.showinfo("Success", f"Added neighborhood: {neighborhood}")
    
    def get_selected_neighborhoods(self):
        """Get the list of selected neighborhoods
        
        Returns:
            list: List of selected neighborhood names
        """
        return [n for n, v in self.selected_neighborhoods.items() if v.get()]
    
    def start_scraping(self):
        """Start the scraping process"""
        # Validate inputs
        query = self.search_query.get().strip()
        if not query:
            messagebox.showwarning("Warning", "Please enter a business type to search for")
            return
        
        neighborhoods = self.get_selected_neighborhoods()
        if not neighborhoods:
            messagebox.showwarning("Warning", "Please select at least one neighborhood")
            return
        
        # Confirm start
        if not messagebox.askyesno("Confirm", f"Start scraping {query} in {len(neighborhoods)} neighborhoods?"):
            return
        
        # Update UI
        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        self.export_button.config(state=tk.DISABLED)
        self.status_label.config(text="Initializing scraper...")
        self.progress_bar.start()
        
        # Clear previous results
        for item in self.results_tree.get_children():
            self.results_tree.delete(item)
        
        self.details_text.config(state=tk.NORMAL)
        self.details_text.delete(1.0, tk.END)
        self.details_text.config(state=tk.DISABLED)
        
        # Start scraping in a separate thread
        self.is_scraping = True
        self.scraping_thread = threading.Thread(target=self.scraping_worker, args=(query, neighborhoods))
        self.scraping_thread.daemon = True
        self.scraping_thread.start()
    
    def scraping_worker(self, query, neighborhoods):
        """Worker function for scraping in a separate thread
        
        Args:
            query (str): Business type to search for
            neighborhoods (list): List of neighborhoods to scrape
        """
        try:
            # Initialize scraper
            self.scraper = GoogleMapsScraper(headless=self.headless_mode.get())
            self.scraper.set_neighborhoods(neighborhoods)
            
            # Start browser
            self.update_status("Starting browser...")
            self.scraper.start_browser()
            
            # Scrape each neighborhood
            total_businesses = 0
            for i, neighborhood in enumerate(neighborhoods):
                if not self.is_scraping:
                    break
                
                self.update_status(f"Scraping {query} in {neighborhood} ({i+1}/{len(neighborhoods)})...")
                
                try:
                    # Scrape the neighborhood
                    businesses = self.scraper.scrape_neighborhood(query, neighborhood)
                    total_businesses += len(businesses)
                    
                    # Update results
                    self.update_results(businesses)
                    
                except Exception as e:
                    self.update_status(f"Error scraping {neighborhood}: {str(e)}")
                    continue
            
            # Finish
            if self.is_scraping:
                self.update_status(f"Scraping completed. Found {total_businesses} businesses.")
                self.root.after(0, lambda: self.export_button.config(state=tk.NORMAL))
            else:
                self.update_status("Scraping stopped by user.")
            
        except Exception as e:
            self.update_status(f"Error: {str(e)}")
        
        finally:
            # Clean up
            try:
                self.scraper.close_browser()
            except:
                pass
            
            # Update UI
            self.is_scraping = False
            self.root.after(0, lambda: self.start_button.config(state=tk.NORMAL))
            self.root.after(0, lambda: self.stop_button.config(state=tk.DISABLED))
            self.root.after(0, lambda: self.progress_bar.stop())
    
    def update_status(self, message):
        """Update the status label from a worker thread
        
        Args:
            message (str): Status message
        """
        self.root.after(0, lambda: self.status_label.config(text=message))
    
    def update_results(self, businesses):
        """Update the results treeview with new businesses
        
        Args:
            businesses (list): List of Business objects
        """
        for business in businesses:
            # Add to treeview
            self.root.after(0, lambda b=business: self.results_tree.insert(
                "", "end", 
                values=(
                    b.name, 
                    b.category, 
                    b.address, 
                    b.neighborhood,
                    b.rating, 
                    b.reviews_count, 
                    b.phone
                ),
                tags=(b.name,)  # Use name as tag for lookup
            ))
    
    def show_business_details(self, event):
        """Show details for the selected business
        
        Args:
            event: Treeview selection event
        """
        # Get selected item
        selection = self.results_tree.selection()
        if not selection:
            return
        
        # Get business data
        item = selection[0]
        values = self.results_tree.item(item, "values")
        
        if not values:
            return
        
        # Find the business in the scraper's list
        business = None
        for b in self.scraper.businesses:
            if b.name == values[0] and b.neighborhood == values[3]:
                business = b
                break
        
        if not business:
            return
        
        # Update details text
        self.details_text.config(state=tk.NORMAL)
        self.details_text.delete(1.0, tk.END)
        
        details = f"Name: {business.name}\n"
        details += f"Category: {business.category}\n"
        details += f"Address: {business.address}\n"
        details += f"Neighborhood: {business.neighborhood}\n"
        details += f"Phone: {business.phone}\n"
        details += f"Website: {business.website}\n"
        details += f"Rating: {business.rating} ({business.reviews_count} reviews)\n"
        
        if business.hours:
            details += "\nHours:\n"
            for day, hours in business.hours.items():
                details += f"  {day}: {hours}\n"
        
        if business.latitude and business.longitude:
            details += f"\nCoordinates: {business.latitude}, {business.longitude}\n"
        
        if business.place_id:
            details += f"Place ID: {business.place_id}\n"
        
        self.details_text.insert(tk.END, details)
        self.details_text.config(state=tk.DISABLED)
    
    def stop_scraping(self):
        """Stop the scraping process"""
        if not self.is_scraping:
            return
        
        if messagebox.askyesno("Confirm", "Stop the scraping process?"):
            self.is_scraping = False
            self.update_status("Stopping scraper...")
    
    def export_results(self):
        """Export the scraped results to a file"""
        if not self.scraper.businesses:
            messagebox.showwarning("Warning", "No data to export")
            return
        
        # Get export format
        export_format = self.export_format.get()
        
        # Get file path
        date_str = datetime.now().strftime("%Y-%m-%d")
        default_filename = f"google_maps_data_{date_str}.{export_format}"
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=f".{export_format}",
            filetypes=[(f"{export_format.upper()} files", f"*.{export_format}")],
            initialfile=default_filename
        )
        
        if not file_path:
            return
        
        # Export data
        try:
            if export_format == "csv":
                result = self.scraper.export_to_csv(file_path)
            else:
                result = self.scraper.export_to_json(file_path)
            
            if result:
                messagebox.showinfo("Success", f"Data exported to {file_path}")
            else:
                messagebox.showerror("Error", "Failed to export data")
                
        except Exception as e:
            messagebox.showerror("Error", f"Export failed: {str(e)}")


# Main entry point
if __name__ == "__main__":
    root = tk.Tk()
    app = GoogleMapsScraperGUI(root)
    root.mainloop()
