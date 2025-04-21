import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User,
  Settings,
  Shield,
  Clock, 
  Mail,
  Key,
  Edit,
  LogOut,
  UserCircle,
  Calendar,
  Bell,
  Lock,
  Smartphone,
  RefreshCw,
  CheckCircle,
  History
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Track scroll position for animation effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
  };

  // Format the joined date nicely
  const formattedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';
    
  // Get username from email
  const username = user?.email?.split('@')[0] || 'User';
  // Get first letter of email for avatar
  const firstLetter = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto pt-28 pb-12 px-4 md:px-6">
          <div className={`transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-2xl">
                  {firstLetter}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome, {username}</h1>
                <p className="text-indigo-100">
                  Manage your profile information and account settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="container mx-auto px-4 md:px-6 -mt-6">
        <Tabs defaultValue="profile" className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-1 mb-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                <History className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Profile Tab */}
          <TabsContent 
            value="profile" 
            className={`transition-all duration-300 ${mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <Card className="lg:col-span-1 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 h-24"></div>
                <div className="-mt-12 flex justify-center">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                      {firstLetter}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="pt-3 text-center">
                  <CardTitle className="text-xl">{username}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">
                      Member
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                    <span>Joined {formattedDate}</span>
                  </div>
                  <Button className="w-full gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-xl flex items-center">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Username</label>
                        <div className="bg-gray-50 p-3 rounded-md text-sm font-medium">
                          {username}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Email Address</label>
                        <div className="bg-gray-50 p-3 rounded-md text-sm font-medium flex justify-between items-center">
                          <span>{user?.email}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Account ID</label>
                        <div className="bg-gray-50 p-3 rounded-md text-xs font-mono truncate">
                          {user?.id}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500">Account Created</label>
                        <div className="bg-gray-50 p-3 rounded-md text-sm font-medium">
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-end bg-gray-50/50 pt-4">
                  <Button variant="outline" className="gap-1.5">
                    <RefreshCw className="h-4 w-4" />
                    <span>Update Information</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent 
            value="security"
            className={`transition-all duration-300 ${mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-indigo-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        <Key className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1">Password</h4>
                        <p className="text-sm text-gray-500 mb-3">Update your password regularly to keep your account secure</p>
                        <Button variant="outline" className="gap-1.5">
                          <Key className="h-3.5 w-3.5" />
                          <span>Change Password</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        <Bell className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1">Notifications</h4>
                        <p className="text-sm text-gray-500 mb-3">Control how we contact you about security and account activity</p>
                        <Button variant="outline" className="gap-1.5">
                          <Bell className="h-3.5 w-3.5" />
                          <span>Notification Settings</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        <Smartphone className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1">Device Management</h4>
                        <p className="text-sm text-gray-500 mb-3">See which devices are currently logged into your account</p>
                        <Button variant="outline" className="gap-1.5">
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>Manage Devices</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between bg-gray-50/50">
                <Button 
                  variant="outline" 
                  className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
                <Button className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Shield className="h-4 w-4" />
                  <span>Security Checkup</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent 
            value="activity"
            className={`transition-all duration-300 ${mounted ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <History className="h-5 w-5 mr-2 text-indigo-600" />
                      Account Activity
                    </CardTitle>
                    <CardDescription>
                      Track your account usage and security events
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                    Coming Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-12">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
                    <div className="relative flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full">
                      <Clock className="h-12 w-12 text-indigo-500 opacity-75" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Activity Tracking Coming Soon</h3>
                  <p className="text-gray-500">
                    We're building a comprehensive activity log to help you monitor your account usage and security events for better protection.
                  </p>
                  <div className="pt-4">
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                      <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
                        <Bell className="h-6 w-6 text-indigo-500 mb-2" />
                        <span className="text-xs text-indigo-700 text-center">Login Alerts</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
                        <Smartphone className="h-6 w-6 text-indigo-500 mb-2" />
                        <span className="text-xs text-indigo-700 text-center">Device History</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
                        <Shield className="h-6 w-6 text-indigo-500 mb-2" />
                        <span className="text-xs text-indigo-700 text-center">Security Logs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile; 