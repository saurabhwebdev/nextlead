import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronsUpDown, MapPin, Search, Star, Phone, Globe, ExternalLink, Clock, ChevronDown, ChevronUp, Download, Copy, Filter, ArrowUpDown, Database, MessageSquare, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scrapeGoogleMaps } from '@/api/mapsClient';
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Sample data for dropdowns
const businessTypes = [
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'retail', name: 'Retail' },
  { id: 'education', name: 'Education' },
  { id: 'technology', name: 'Technology' }
];

const subcategories = {
  healthcare: [
    { id: 'dentist', name: 'Dentist' },
    { id: 'cardiologist', name: 'Cardiologist' },
    { id: 'pediatrician', name: 'Pediatrician' },
    { id: 'orthopedic', name: 'Orthopedic Surgeon' },
    { id: 'dermatologist', name: 'Dermatologist' }
  ],
  hospitality: [
    { id: 'hotel', name: 'Hotel' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'cafe', name: 'Cafe' },
    { id: 'bar', name: 'Bar' },
    { id: 'resort', name: 'Resort' }
  ],
  retail: [
    { id: 'clothing', name: 'Clothing Store' },
    { id: 'electronics', name: 'Electronics Store' },
    { id: 'grocery', name: 'Grocery Store' },
    { id: 'furniture', name: 'Furniture Store' },
    { id: 'jewelry', name: 'Jewelry Store' }
  ],
  education: [
    { id: 'school', name: 'School' },
    { id: 'college', name: 'College' },
    { id: 'university', name: 'University' },
    { id: 'tutor', name: 'Tutoring Center' },
    { id: 'coaching', name: 'Coaching Institute' }
  ],
  technology: [
    { id: 'software', name: 'Software Company' },
    { id: 'hardware', name: 'Hardware Store' },
    { id: 'consulting', name: 'IT Consulting' },
    { id: 'service', name: 'IT Services' },
    { id: 'startup', name: 'Tech Startup' }
  ]
};

const locations = [
  { id: 'mumbai', name: 'Mumbai' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'bangalore', name: 'Bangalore' },
  { id: 'hyderabad', name: 'Hyderabad' },
  { id: 'chennai', name: 'Chennai' }
];

const localities = {
  mumbai: [
    { id: 'bandra', name: 'Bandra' },
    { id: 'juhu', name: 'Juhu' },
    { id: 'andheri', name: 'Andheri' },
    { id: 'colaba', name: 'Colaba' },
    { id: 'dadar', name: 'Dadar' },
    { id: 'worli', name: 'Worli' }
  ],
  delhi: [
    { id: 'connaught', name: 'Connaught Place' },
    { id: 'hauz', name: 'Hauz Khas' },
    { id: 'chandni', name: 'Chandni Chowk' },
    { id: 'dwarka', name: 'Dwarka' },
    { id: 'saket', name: 'Saket' }
  ],
  bangalore: [
    { id: 'koramangala', name: 'Koramangala' },
    { id: 'indiranagar', name: 'Indiranagar' },
    { id: 'jayanagar', name: 'Jayanagar' },
    { id: 'whitefield', name: 'Whitefield' },
    { id: 'electronic', name: 'Electronic City' }
  ],
  hyderabad: [
    { id: 'banjara', name: 'Banjara Hills' },
    { id: 'jubilee', name: 'Jubilee Hills' },
    { id: 'hitech', name: 'Hitech City' },
    { id: 'gachibowli', name: 'Gachibowli' },
    { id: 'secunderabad', name: 'Secunderabad' }
  ],
  chennai: [
    { id: 'adyar', name: 'Adyar' },
    { id: 'besant', name: 'Besant Nagar' },
    { id: 'nungambakkam', name: 'Nungambakkam' },
    { id: 'thambaram', name: 'Tambaram' },
    { id: 'velachery', name: 'Velachery' }
  ]
};

// Type definitions
interface Business {
  title: string;
  rating?: string;
  reviews?: string;
  type?: string;
  address?: string;
  openState?: string;
  phone?: string;
  website?: string;
  description?: string;
  serviceOptions?: string;
  coordinates?: { latitude: string; longitude: string } | null;
  thumbnail?: string;
  searchQuery?: string;
}

interface FeedbackFormData {
  type: 'bug' | 'feature' | 'improvement' | 'legal' | 'other';
  message: string;
  rating?: number;
}

const LeadGen = () => {
  const [businessType, setBusinessType] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [localitySearch, setLocalitySearch] = useState('');
  const [additionalKeywords, setAdditionalKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState('search');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [filteredResults, setFilteredResults] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollCount, setScrollCount] = useState(5);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing scraper...");
  const [scrapedCount, setScrapedCount] = useState(0);
  const [currentArea, setCurrentArea] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    type: 'improvement',
    message: '',
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const { user } = useAuth();

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value);
    setSubcategory('');
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setSelectedLocalities([]);
  };

  const handleLocalitySelect = (locality: string) => {
    setSelectedLocalities(prevSelected => {
      if (prevSelected.includes(locality)) {
        return prevSelected.filter(item => item !== locality);
      } else {
        return [...prevSelected, locality];
      }
    });
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortedResults = () => {
    if (!sortConfig) return filteredResults;
    
    return [...filteredResults].sort((a, b) => {
      if (sortConfig.key === 'rating') {
        // Safely extract rating values as strings first
        const aRating = typeof a.rating === 'string' ? a.rating : '';
        const bRating = typeof b.rating === 'string' ? b.rating : '';
        
        // Convert to numbers for comparison
        const aNum = parseFloat(aRating) || 0;
        const bNum = parseFloat(bRating) || 0;
        
        return sortConfig.direction === 'ascending' 
          ? aNum - bNum
          : bNum - aNum;
      }
      
      // Get the values based on the key
      const aValue = a[sortConfig.key as keyof Business] || '';
      const bValue = b[sortConfig.key as keyof Business] || '';
      
      // String comparison for other fields
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
      duration: 2000
    });
  };

  const handleSubmit = async () => {
    if (!businessType || !subcategory || !location || selectedLocalities.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before scraping.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResults([]);
    setFilteredResults([]);
    setLoadingProgress(0);
    setElapsedTime(0);
    setScrapedCount(0);
    setCurrentArea('');
    setLoadingMessage("Initializing scraper...");
    
    // Start a timer to track elapsed time in seconds
    const timerInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Progress tracking interval - only for visual feedback
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return Math.min(prev + Math.random() * 2, 95);
      });
    }, 500);
    
    try {
      const localityNames = selectedLocalities.map(id => {
        const localityObj = localities[location as keyof typeof localities]?.find(l => l.id === id);
        return localityObj?.name || id;
      });
      
      const data = await scrapeGoogleMaps({
        businessType,
        subcategory,
        location: locations.find(loc => loc.id === location)?.name || location,
        selectedLocalities: localityNames,
        additionalKeywords,
        scrollCount,
        onProgress: (progress: number, count: number, area?: string) => {
          setLoadingProgress(Math.min(95, progress));
          if (count > 0) setScrapedCount(count);
          if (area) setCurrentArea(area);
          
          // Update loading message based on progress
          if (progress > 80) {
            setLoadingMessage("Finalizing and processing results...");
          } else if (progress > 60) {
            setLoadingMessage("Extracting business details...");
          } else if (progress > 30) {
            setLoadingMessage("Scrolling and collecting data...");
          } else {
            setLoadingMessage("Searching for businesses...");
          }
        }
      });
      
      // Set progress to 100% when done
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setLoadingProgress(100);
      setLoadingMessage("Completed! Processing results...");
      
      // Small delay to show 100% before hiding the loader
      setTimeout(() => {
        if (data.success && data.results) {
          setScrapedCount(data.results.length);
          setResults(data.results);
          setFilteredResults(data.results);
          setActiveTab('results');
          
          toast({
            title: "Search complete",
            description: `Found ${data.results.length} businesses matching your criteria.`
          });
        } else {
          throw new Error('No results returned');
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setLoadingProgress(100);
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve business data. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredResults(results);
      return;
    }
    
    const searchLower = term.toLowerCase();
    const filtered = results.filter(business => 
      business.title?.toLowerCase().includes(searchLower) ||
      business.address?.toLowerCase().includes(searchLower) ||
      business.phone?.toLowerCase().includes(searchLower) ||
      business.type?.toLowerCase().includes(searchLower)
    );
    
    setFilteredResults(filtered);
  };

  const getLocalityName = (id: string) => {
    if (!location) return id;
    const localityObj = localities[location as keyof typeof localities]?.find(l => l.id === id);
    return localityObj?.name || id;
  };

  const exportToCSV = () => {
    if (filteredResults.length === 0) {
      toast({
        title: "No data to export",
        description: "Please run a search first to get some results.",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Business Name',
      'Type',
      'Address',
      'Phone',
      'Website',
      'Rating',
      'Reviews',
      'Opening Hours',
      'Description',
      'Service Options'
    ];

    const csvData = [
      headers.join(','),
      ...filteredResults.map(business => {
        return [
          `"${business.title || ''}"`,
          `"${business.type || ''}"`,
          `"${business.address || ''}"`,
          `"${business.phone || ''}"`,
          `"${business.website || ''}"`,
          `"${business.rating || ''}"`,
          `"${business.reviews || ''}"`,
          `"${business.openState || ''}"`,
          `"${business.description || ''}"`,
          `"${business.serviceOptions || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mapHarvest_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToSupabase = async () => {
    if (filteredResults.length === 0) {
      toast({
        title: "No data to save",
        description: "Please run a search first to get some results.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save data.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setLoadingProgress(0);
      setElapsedTime(0);
      setLoadingMessage("Saving data to Supabase...");
      
      // Start a timer to track elapsed time
      const timerInterval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      // Create a progress interval
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + Math.random() * 5, 95));
      }, 200);

      // Prepare data for Supabase
      const businessData = filteredResults.map(business => ({
        title: business.title,
        type: business.type || null,
        address: business.address || null,
        phone: business.phone || null,
        website: business.website || null,
        rating: business.rating || null,
        reviews: business.reviews || null,
        open_state: business.openState || null,
        description: business.description || null,
        service_options: business.serviceOptions || null,
        latitude: business.coordinates?.latitude || null,
        longitude: business.coordinates?.longitude || null,
        search_query: business.searchQuery || null,
        created_at: new Date().toISOString(),
        user_id: user.id
      }));

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData);

      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setLoadingProgress(100);

      if (error) {
        throw error;
      }

      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Success!",
          description: `Saved ${businessData.length} businesses to your database.`,
          duration: 3000
        });
      }, 500);
    } catch (error: any) {
      console.error('Error saving to Supabase:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to save data to Supabase.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handleFeedbackChange = (field: keyof FeedbackFormData, value: any) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitFeedback = async () => {
    if (!feedbackForm.message.trim()) {
      toast({
        title: "Please enter a message",
        description: "We need your feedback to improve the tool.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback.",
        variant: "destructive"
      });
      return;
    }

    setFeedbackSubmitting(true);
    
    try {
      // Get browser info
      const browserInfo = JSON.stringify({
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      });

      // Insert feedback to Supabase
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: feedbackForm.type,
          message: feedbackForm.message,
          rating: feedbackForm.rating,
          page: 'LeadGen',
          browser_info: browserInfo,
        });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it soon.",
      });

      // Reset form and close modal
      setFeedbackForm({
        type: 'improvement',
        message: '',
      });
      setFeedbackOpen(false);
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const sortedResults = getSortedResults();

  // Helper function to format elapsed time as mm:ss
  const formatElapsedTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-16 relative">
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center mb-3">
              <div className="w-16 h-16 mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                {loadingMessage}
              </h3>
              {currentArea && (
                <p className="text-sm text-indigo-600 mt-1 font-medium">
                  Searching in {currentArea}
                </p>
              )}
              {scrapedCount > 0 && (
                <div className="mt-2 flex items-center justify-center bg-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-indigo-700 font-medium">{scrapedCount} businesses found</span>
                </div>
              )}
            </div>
            
            <div className="mb-1 text-sm font-medium text-gray-700 flex justify-between">
              <span>Processing</span>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500">
                  Elapsed: {formatElapsedTime(elapsedTime)}
                </span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
            </div>
            
            <Progress 
              value={loadingProgress} 
              className="h-2 mb-5" 
            />
            
            {scrollCount > 5 && (
              <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-100 rounded text-sm text-amber-700">
                <p className="flex items-start">
                  <Clock className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Scraping with {scrollCount} scrolls may take longer. Please be patient.</span>
                </p>
              </div>
            )}
            
            <div className="w-full h-0.5 mb-6 relative overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 animate-gradient"></div>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              <p>Please wait while we extract business information.</p>
              <div className="mt-4 flex items-center justify-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.5s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1.5s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-700 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Criteria</TabsTrigger>
          <TabsTrigger value="results" disabled={results.length === 0}>
            Results {results.length > 0 ? `(${filteredResults.length}/${results.length})` : ''}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4 mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Google Maps Scraper</CardTitle>
              <CardDescription>
                Select your search criteria to find businesses in your target area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessType} onValueChange={handleBusinessTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Business Categories</SelectLabel>
                        {businessTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select 
                    value={subcategory} 
                    onValueChange={setSubcategory}
                    disabled={!businessType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={businessType ? "Select subcategory" : "First select business type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subcategories</SelectLabel>
                        {businessType && subcategories[businessType as keyof typeof subcategories]?.map(sub => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    value={location} 
                    onValueChange={handleLocationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Cities</SelectLabel>
                        {locations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Localities</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!location}
                      >
                        {selectedLocalities.length > 0
                          ? `${selectedLocalities.length} selected`
                          : location 
                            ? "Select localities" 
                            : "First select location"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-2">
                        <Input
                          placeholder="Search localities..."
                          value={localitySearch}
                          onChange={(e) => setLocalitySearch(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      <Separator />
                      {location ? (
                        <ScrollArea className="h-72">
                          <div className="p-2 space-y-1">
                            {localities[location as keyof typeof localities]
                              ?.filter(locality => 
                                locality.name.toLowerCase().includes(localitySearch.toLowerCase())
                              )
                              .map(locality => (
                                <div
                                  key={locality.id}
                                  className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100"
                                >
                                  <Checkbox
                                    id={`locality-${locality.id}`}
                                    checked={selectedLocalities.includes(locality.id)}
                                    onCheckedChange={() => handleLocalitySelect(locality.id)}
                                  />
                                  <Label
                                    htmlFor={`locality-${locality.id}`}
                                    className="flex-grow text-sm font-normal cursor-pointer"
                                  >
                                    {locality.name}
                                  </Label>
                                </div>
                              ))}
                            {localities[location as keyof typeof localities]?.filter(locality => 
                              locality.name.toLowerCase().includes(localitySearch.toLowerCase())
                            ).length === 0 && (
                              <div className="px-2 py-6 text-center text-sm text-gray-500">
                                No localities found matching "{localitySearch}"
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="px-2 py-6 text-center text-sm text-gray-500">
                          Please select a location first
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {selectedLocalities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedLocalities.map(localityId => (
                    <Badge key={localityId} variant="secondary" className="text-xs">
                      {getLocalityName(localityId)}
                      <button 
                        className="ml-1 hover:text-red-500" 
                        onClick={() => handleLocalitySelect(localityId)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Additional Keywords (Optional)</Label>
                <Input 
                  placeholder="E.g., 24 hours, family owned, etc." 
                  value={additionalKeywords}
                  onChange={(e) => setAdditionalKeywords(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scrollCount">Scroll Count</Label>
                <Select 
                  value={scrollCount.toString()}
                  onValueChange={(value) => setScrollCount(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of scrolls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Scroll Options</SelectLabel>
                      <SelectItem value="3">Minimal (3 scrolls)</SelectItem>
                      <SelectItem value="5">Default (5 scrolls)</SelectItem>
                      <SelectItem value="10">Extended (10 scrolls)</SelectItem>
                      <SelectItem value="15">Maximum (15 scrolls)</SelectItem>
                      <SelectItem value="20">Complete (20 scrolls)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Controls how many results are loaded by scrolling the page.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setBusinessType('');
                setSubcategory('');
                setLocation('');
                setSelectedLocalities([]);
                setAdditionalKeywords('');
                setScrollCount(5);
              }}>
                Reset
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !businessType || !subcategory || !location || selectedLocalities.length === 0}
              >
                <Search className="mr-2 h-4 w-4" />
                Scrape Leads
              </Button>
            </CardFooter>
          </Card>

          {/* Data scraping legal and feedback section */}
          <div className="mt-6 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100 rounded-xl">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left side - Disclaimer */}
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <h3 className="ml-3 text-base font-semibold text-blue-900">Data Scraping Guidelines</h3>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-relaxed text-gray-700">
                      Our scraper tool extracts publicly available business information from Google Maps.
                      Please use this data responsibly and ethically.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-xs leading-tight text-gray-700">
                          Use for legitimate business research and lead generation only
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-xs leading-tight text-gray-700">
                          Adhere to Google's Terms of Service
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-xs leading-tight text-gray-700">
                          Limit requests to avoid excessive scraping
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-xs leading-tight text-gray-700">
                          Handle all data in compliance with privacy laws
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vertical separator */}
                <div className="hidden md:block w-px h-auto bg-blue-200"></div>
                
                {/* Right side - Feedback */}
                <div className="flex-1 mt-5 md:mt-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                    </div>
                    <h3 className="ml-3 text-base font-semibold text-indigo-900">We Value Your Feedback</h3>
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    We're constantly improving this tool and would love to hear your thoughts on how we can make it better.
                  </p>
                  
                  <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-sm transition-all duration-150"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Share Your Feedback</span>
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share Your Feedback</DialogTitle>
                        <DialogDescription>
                          Help us improve the lead generation tool with your suggestions or report any issues.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label>Feedback Type</Label>
                          <RadioGroup 
                            value={feedbackForm.type}
                            onValueChange={(value) => handleFeedbackChange('type', value)}
                            className="flex flex-wrap gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="bug" id="feedback-bug" />
                              <Label htmlFor="feedback-bug">Bug</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="feature" id="feedback-feature" />
                              <Label htmlFor="feedback-feature">Feature Request</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="improvement" id="feedback-improvement" />
                              <Label htmlFor="feedback-improvement">Improvement</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="legal" id="feedback-legal" />
                              <Label htmlFor="feedback-legal">Legal/Privacy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="feedback-other" />
                              <Label htmlFor="feedback-other">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="feedback-message">Message</Label>
                          <Textarea
                            id="feedback-message"
                            placeholder="Please describe your feedback in detail"
                            value={feedbackForm.message}
                            onChange={(e) => handleFeedbackChange('message', e.target.value)}
                            rows={5}
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>How would you rate this feature? (Optional)</Label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                type="button"
                                variant={feedbackForm.rating === rating ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => handleFeedbackChange('rating', rating)}
                              >
                                {rating}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={feedbackSubmitting || !feedbackForm.message.trim()}
                          onClick={submitFeedback}
                        >
                          {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4 mt-4">
          {results.length > 0 ? (
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-800">Business Leads</CardTitle>
                    <CardDescription>
                      {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search results..."
                        className="pl-8 w-full sm:w-[240px]"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      <span>Export to CSV</span>
                    </Button>
                    
                    <Button 
                      onClick={saveToSupabase} 
                      size="sm" 
                      className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Database className="h-4 w-4" />
                      <span>Save to Database</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="border rounded-md">
                  <div className="overflow-auto max-h-[70vh]">
                    <Table className="w-full border-collapse">
                      <TableHeader className="bg-white sticky top-0 z-10">
                        <TableRow className="border-b border-gray-200 bg-gray-50">
                          <TableHead 
                            className="w-[200px] cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700"
                            onClick={() => handleSort('title')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Business Name</span>
                              {sortConfig?.key === 'title' ? (
                                sortConfig.direction === 'ascending' 
                                  ? <ChevronUp className="h-4 w-4" /> 
                                  : <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700"
                            onClick={() => handleSort('type')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Type</span>
                              {sortConfig?.key === 'type' ? (
                                sortConfig.direction === 'ascending' 
                                  ? <ChevronUp className="h-4 w-4" /> 
                                  : <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700"
                            onClick={() => handleSort('rating')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Rating</span>
                              {sortConfig?.key === 'rating' ? (
                                sortConfig.direction === 'ascending' 
                                  ? <ChevronUp className="h-4 w-4" /> 
                                  : <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 hidden md:table-cell"
                            onClick={() => handleSort('address')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Address</span>
                              {sortConfig?.key === 'address' ? (
                                sortConfig.direction === 'ascending' 
                                  ? <ChevronUp className="h-4 w-4" /> 
                                  : <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700"
                            onClick={() => handleSort('phone')}
                          >
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1.5 text-indigo-600" />
                              <span className="text-indigo-600 font-medium">Phone</span>
                              {sortConfig?.key === 'phone' ? (
                                sortConfig.direction === 'ascending' 
                                  ? <ChevronUp className="h-4 w-4 ml-1" /> 
                                  : <ChevronDown className="h-4 w-4 ml-1" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-50 ml-1" />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead className="border-r border-gray-200 font-semibold text-gray-700 hidden lg:table-cell">
                            Hours
                          </TableHead>
                          
                          <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      
                      <TableBody>
                        {sortedResults.length > 0 ? (
                          sortedResults.map((business, index) => (
                            <TableRow 
                              key={index} 
                              className={`group border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 text-xs`}
                            >
                              <TableCell className="font-medium border-r border-gray-200 py-1.5">
                                <span className="font-semibold text-gray-800">{business.title}</span>
                              </TableCell>
                              
                              <TableCell className="border-r border-gray-200 py-1.5">
                                <span className="text-gray-600">{business.type || '-'}</span>
                              </TableCell>
                              
                              <TableCell className="border-r border-gray-200 py-1.5">
                                {business.rating ? (
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
                                    <span className="font-medium">{business.rating}</span>
                                    {business.reviews && (
                                      <span className="text-gray-400 ml-1">({business.reviews})</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              
                              <TableCell className="hidden md:table-cell border-r border-gray-200 py-1.5">
                                <div className="text-gray-600 whitespace-normal break-words max-w-[250px] leading-tight">
                                  {business.address || '-'}
                                </div>
                              </TableCell>
                              
                              <TableCell className="border-r border-gray-200 py-1.5">
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 text-indigo-600 mr-1 flex-shrink-0" />
                                  <span className="text-gray-800 font-medium">{business.phone || '-'}</span>
                                </div>
                              </TableCell>
                              
                              <TableCell className="hidden lg:table-cell border-r border-gray-200 py-1.5">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                                  <span className="text-gray-600 whitespace-normal break-words max-w-[180px] leading-tight">
                                    {business.openState || '-'}
                                  </span>
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-right py-1.5">
                                <div className="flex items-center justify-end space-x-1">
                                  {business.website && (
                                    <a
                                      href={business.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="Visit website"
                                    >
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Globe className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  )}
                                  
                                  {business.coordinates && (
                                    <a
                                      href={`https://www.google.com/maps?q=${business.coordinates.latitude},${business.coordinates.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="View on Google Maps"
                                    >
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MapPin className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  )}
                                  
                                  {business.phone && (
                                    <a
                                      href={`tel:${business.phone}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="Call business"
                                    >
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Phone className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-10 border-b border-gray-200">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <Filter className="h-8 w-8 mb-2" />
                                <p>No matching results found.</p>
                                <p className="text-sm">Try adjusting your search filters.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-500">
                  Showing {filteredResults.length} of {results.length} results
                </div>
                <Button variant="outline" onClick={() => setActiveTab('search')}>
                  Back to Search
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No results yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Run a search to see business results here.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('search')}
              >
                Back to Search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadGen; 