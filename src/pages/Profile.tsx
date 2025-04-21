import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto pt-24 pb-12 px-4 md:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          </div>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="gap-1">
            <Shield className="h-3.5 w-3.5" />
            <span>Security</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span>Preferences</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-medium mb-1">{user?.email?.split('@')[0]}</h3>
            <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account Details</CardTitle>
            <CardDescription>
              Your personal information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Email</span>
                    </div>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">User ID</span>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[200px]">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Joined</span>
                    </div>
                    <span className="text-sm font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Security</h4>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Key className="h-4 w-4 text-gray-500" />
                    <span>Change Password</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Account Activity
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
              Coming Soon
            </Badge>
          </h2>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <Clock className="h-12 w-12 text-indigo-400 mx-auto mb-4 opacity-75" />
            <h3 className="text-xl font-medium mb-2">Activity Tracking Coming Soon</h3>
            <p className="text-gray-500 mb-4">
              We're building a comprehensive activity log to help you track your account usage and security events.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">
                Login History
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">
                Device Management
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">
                Security Logs
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile; 