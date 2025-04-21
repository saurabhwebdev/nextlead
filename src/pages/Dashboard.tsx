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
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 md:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 font-medium">
              Coming Soon
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">Welcome back, {user?.email?.split('@')[0]}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="gap-1">
            <Bell className="h-3.5 w-3.5" />
            <span>Notifications</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </Button>
        </div>
      </div>
      
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-12 md:py-24 relative">
            <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
              <Rocket className="w-full h-full" />
            </div>
            
            <div className="max-w-2xl relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Dashboard Experience Coming Soon
              </h2>
              <p className="text-indigo-100 text-lg mb-6">
                We're building a comprehensive analytics dashboard to help you track your lead generation performance and business insights.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Lead Analytics
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Performance Tracking
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Business Intelligence
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                  Custom Reports
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-950/50 border-t border-indigo-500/20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-indigo-100 text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2 text-indigo-300" />
                <span>Estimated release: Q2 2024</span>
              </div>
              <Button size="sm" variant="secondary" className="bg-white text-indigo-700 hover:bg-indigo-100">
                <Mail className="h-4 w-4 mr-2" />
                <span>Get Notified</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <h2 className="text-2xl font-bold tracking-tight mb-6">Account Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Business Insights
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
              Coming Soon
            </Badge>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group hover:border-indigo-200 transition-colors cursor-not-allowed opacity-80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                <span>Lead Conversion</span>
              </CardTitle>
              <CardDescription>Track lead conversions over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
                <Info className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:border-indigo-200 transition-colors cursor-not-allowed opacity-80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4 text-indigo-600" />
                <span>Industry Distribution</span>
              </CardTitle>
              <CardDescription>Analyze business types by sector</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
                <Info className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:border-indigo-200 transition-colors cursor-not-allowed opacity-80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <LineChart className="h-4 w-4 text-indigo-600" />
                <span>Growth Metrics</span>
              </CardTitle>
              <CardDescription>Measure business performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
                <Info className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
