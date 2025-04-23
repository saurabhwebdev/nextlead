import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Info, 
  LineChart, 
  Mail, 
  PieChart, 
  Rocket, 
  ServerCrash,
  Bell,
  Building,
  TrendingUp,
  Star,
  Activity,
  Users,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, PieChart as RePieChart, Cell, XAxis, YAxis, Bar, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

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

interface FeedbackItem {
  id: string;
  feedback_type: string;
  message: string;
  rating: number | null;
  page: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [leadCount, setLeadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [businessTypes, setBusinessTypes] = useState<{type: string, count: number}[]>([]);
  const [ratingsDistribution, setRatingsDistribution] = useState<{rating: string, count: number}[]>([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [locationData, setLocationData] = useState<{city: string, count: number}[]>([]);
  
  // Calculate the date 30 days ago for recent activity
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch lead count
        const { count: businessCount, error: countError } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (countError) throw countError;
        setLeadCount(businessCount || 0);
        
        // Fetch most recent businesses
        const { data: recentData, error: recentError } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentError) throw recentError;
        setRecentBusinesses(recentData || []);
        
        // Fetch all businesses for analysis
        const { data: allBusinesses, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id);
        
        if (businessError) throw businessError;
        
        // Process business type data
        const typeMap = new Map<string, number>();
        const ratingMap = new Map<string, number>();
        const cityMap = new Map<string, number>();
        
        console.log('All businesses:', allBusinesses); // Debug logging
        
        allBusinesses?.forEach(business => {
          // Process business types - improved handling
          let type = 'Uncategorized';
          if (business.type) {
            // Clean up the type if needed (remove extra spaces, normalize case, etc.)
            type = business.type.trim();
            if (type === '') type = 'Uncategorized';
          }
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
          
          // Process ratings
          if (business.rating) {
            const rating = parseFloat(business.rating).toFixed(1);
            ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
          }
          
          // Process locations (basic extraction, in a real app this would be more sophisticated)
          if (business.address) {
            const addressParts = business.address.split(',');
            if (addressParts.length > 1) {
              const city = addressParts[addressParts.length - 2].trim();
              cityMap.set(city, (cityMap.get(city) || 0) + 1);
            }
          }
        });
        
        console.log('Type map:', Array.from(typeMap.entries())); // Debug logging
        
        // Convert maps to arrays for charts with improved sorting and naming
        const businessTypesData = Array.from(typeMap.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        console.log('Business types data:', businessTypesData); // Debug logging
        setBusinessTypes(businessTypesData);
        
        setRatingsDistribution(
          Array.from(ratingMap.entries())
            .map(([rating, count]) => ({ rating, count }))
            .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        );
        
        setLocationData(
          Array.from(cityMap.entries())
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );
        
        // Fetch feedback count
        const { count: fbCount, error: fbError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (fbError) throw fbError;
        setFeedbackCount(fbCount || 0);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getAverageRating = () => {
    if (!ratingsDistribution.length) return "N/A";
    
    const total = ratingsDistribution.reduce((sum, item) => 
      sum + parseFloat(item.rating) * item.count, 0);
    const count = ratingsDistribution.reduce((sum, item) => sum + item.count, 0);
    
    return (total / count).toFixed(1);
  };

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 md:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last 30 Days</span>
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-indigo-100 mr-3 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-3xl font-bold">{loading ? '...' : leadCount}</div>
                <p className="text-xs text-gray-500">businesses saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-yellow-100 mr-3 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl font-bold">{loading ? '...' : getAverageRating()}</div>
                <p className="text-xs text-gray-500">out of 5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Most Common Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold truncate max-w-[140px]">
                  {loading ? '...' : (businessTypes.length > 0 ? businessTypes[0].type : 'N/A')}
                </div>
                <p className="text-xs text-gray-500">
                  {loading ? '...' : (businessTypes.length > 0 ? `${businessTypes[0].count} businesses` : 'No data')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold truncate max-w-[140px]">
                  {loading ? '...' : (locationData.length > 0 ? locationData[0].city : 'N/A')}
                </div>
                <p className="text-xs text-gray-500">
                  {loading ? '...' : (locationData.length > 0 ? `${locationData[0].count} businesses` : 'No location data')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Business Types</CardTitle>
            <CardDescription>Distribution by industry category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
              ) : businessTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={businessTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={(entry) => entry.type}
                    >
                      {businessTypes.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} businesses`, 
                        props.payload.type
                      ]} 
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <PieChart className="h-12 w-12 mb-2 opacity-30" />
                  <p>No business type data available</p>
                  <p className="text-sm">Add more leads to see insights</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
            <CardDescription>Number of businesses by rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
              ) : ratingsDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ratingsDistribution}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} businesses`, 'Count']} />
                    <Bar dataKey="count" name="Businesses" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mb-2 opacity-30" />
                  <p>No rating data available</p>
                  <p className="text-sm">Add more leads to see rating distribution</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Recent Activity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Recently Added Leads</span>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-500" asChild>
                  <Link to="/leads">
                    <span>View all</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
              ) : recentBusinesses.length > 0 ? (
                <div className="space-y-4">
                  {recentBusinesses.map((business) => (
                    <div key={business.id} className="flex items-start border-b border-gray-100 pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{business.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" />
                            {business.type || 'Unknown type'}
                          </span>
                          {business.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-yellow-500" />
                              {business.rating}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Added {new Date(business.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" asChild>
                        <Link to={`/leads?id=${business.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <ServerCrash className="h-12 w-12 mb-2 opacity-30" />
                  <p>No leads found</p>
                  <p className="text-sm mt-1">Start by adding some leads</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link to="/lead-gen">
                      Generate Leads
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <ServerCrash className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Total Leads</span>
                  </div>
                  <span className="font-bold">{loading ? '...' : leadCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Recent Leads</span>
                  </div>
                  <span className="font-bold">{loading ? '...' : recentBusinesses.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Feedback Submitted</span>
                  </div>
                  <span className="font-bold">{loading ? '...' : feedbackCount}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/lead-gen">
                      Generate More Leads
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Account Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-medium text-xs truncate max-w-[180px]">{user?.id}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Saved Leads:</span>
                  <span className="font-medium">{loading ? '...' : leadCount}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Quick Access</span>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-500" asChild>
                  <Link to="/leads">
                    <span>View all</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-auto py-4 justify-start gap-3" asChild>
                  <Link to="/lead-gen">
                    <div className="h-10 w-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <LineChart className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Lead Generation</span>
                      <span className="text-xs text-gray-500">Find new business leads</span>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="h-auto py-4 justify-start gap-3" asChild>
                  <Link to="/leads">
                    <div className="h-10 w-10 rounded-md bg-green-100 text-green-700 flex items-center justify-center">
                      <ServerCrash className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Saved Leads</span>
                      <span className="text-xs text-gray-500">Manage your lead database</span>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
