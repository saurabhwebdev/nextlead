import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Phone, Download, Star, Clock, ChevronDown, ChevronUp, ArrowUpDown, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Business {
  id: string;
  title: string;
  type: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: string | null;
  reviews: string | null;
  open_state: string | null;
  description: string | null;
  service_options: string | null;
  latitude: string | null;
  longitude: string | null;
  search_query: string | null;
  created_at: string;
}

const Leads = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setBusinesses(data || []);
        setFilteredBusinesses(data || []);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = businesses.filter(business => 
        business.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        business.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusinesses(filtered);
      setCurrentPage(1);
    } else {
      setFilteredBusinesses(businesses);
    }
  }, [searchTerm, businesses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortedBusinesses = () => {
    if (!sortConfig) {
      return filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);
    }

    const sortedItems = [...filteredBusinesses].sort((a, b) => {
      if (!a[sortConfig.key as keyof Business] && !b[sortConfig.key as keyof Business]) return 0;
      if (!a[sortConfig.key as keyof Business]) return 1;
      if (!b[sortConfig.key as keyof Business]) return -1;

      const valueA = a[sortConfig.key as keyof Business];
      const valueB = b[sortConfig.key as keyof Business];

      if (valueA === null || valueB === null) {
        return valueA === valueB ? 0 : valueA === null ? 1 : -1;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (sortConfig.key === 'rating') {
          return sortConfig.direction === 'ascending'
            ? parseFloat(valueA) - parseFloat(valueB)
            : parseFloat(valueB) - parseFloat(valueA);
        }
        return sortConfig.direction === 'ascending'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });

    return sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedItems = getSortedBusinesses();
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredBusinesses.length === 0) return;

    const headers = [
      'Business Name',
      'Type',
      'Rating',
      'Reviews',
      'Address',
      'Phone',
      'Website',
      'Open State',
      'Date Added'
    ];

    const csvData = filteredBusinesses.map(business => [
      business.title,
      business.type || '',
      business.rating || '',
      business.reviews || '',
      business.address || '',
      business.phone || '',
      business.website || '',
      business.open_state || '',
      new Date(business.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `saved_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto pt-24 pb-10 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-gray-800">Business Leads</CardTitle>
              <CardDescription>
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'result' : 'results'} found
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search results..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                <span>Export to CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No businesses found. Try generating leads in the Lead Gen page.</p>
            </div>
          ) : (
            <div className="border rounded-md relative">
              <div className="overflow-auto max-h-[70vh]">
                <Table className="w-full border-collapse">
                  <TableHeader className="sticky top-0 z-20 shadow-sm">
                    <TableRow className="border-b border-gray-200 bg-gray-50">
                      <TableHead 
                        className="w-[200px] cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 bg-gray-50"
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
                        className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 bg-gray-50"
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
                        className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 bg-gray-50"
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
                        className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 hidden md:table-cell bg-gray-50"
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
                        className="cursor-pointer hover:bg-gray-100 border-r border-gray-200 font-semibold text-gray-700 bg-gray-50"
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
                      
                      <TableHead className="border-r border-gray-200 font-semibold text-gray-700 hidden lg:table-cell bg-gray-50">
                        Hours
                      </TableHead>
                      
                      <TableHead className="font-semibold text-gray-700 text-right bg-gray-50">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {sortedItems.map((business, index) => (
                      <TableRow 
                        key={business.id} 
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
                              {business.open_state || '-'}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right py-1.5">
                          <div className="flex items-center justify-end space-x-1">
                            {business.website && (
                              <Button size="icon" variant="ghost" className="h-7 w-7 opacity-70 hover:opacity-100" title="Visit Website" asChild>
                                <a href={business.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            {business.phone && (
                              <Button size="icon" variant="ghost" className="h-7 w-7 opacity-70 hover:opacity-100" title="Call Business" asChild>
                                <a href={`tel:${business.phone}`}>
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          {totalPages > 1 && (
            <Pagination className="mt-4 flex justify-center">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {
                      e.preventDefault();
                      paginate(currentPage - 1);
                    }} />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  // Show limited page numbers to avoid clutter
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            paginate(pageNumber);
                          }}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Add ellipsis for skipped page numbers
                  if (
                    (pageNumber === currentPage - 2 && pageNumber > 2) ||
                    (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
                  ) {
                    return <PaginationItem key={pageNumber}>...</PaginationItem>;
                  }
                  
                  return null;
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {
                      e.preventDefault();
                      paginate(currentPage + 1);
                    }} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads; 