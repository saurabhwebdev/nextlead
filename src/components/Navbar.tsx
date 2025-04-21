import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  LogOut, 
  User, 
  LineChart, 
  Database, 
  Home, 
  X,
  Map,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position to add shadow on scroll
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={cn(
        "bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 transition-all duration-200",
        scrolled ? "border-b border-gray-200 shadow-sm" : "border-b border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg h-8 w-8 flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-200">
                <Map className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                MapHarvest
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')}>
              <Home className="h-4 w-4 mr-1.5" />
              Home
            </NavLink>
            
            {user && (
              <>
                <NavLink to="/lead-gen" active={isActive('/lead-gen')}>
                  <LineChart className="h-4 w-4 mr-1.5" />
                  Lead Gen
                </NavLink>
                <NavLink to="/leads" active={isActive('/leads')}>
                  <Database className="h-4 w-4 mr-1.5" />
                  Leads
                </NavLink>
              </>
            )}
            
            <div className="ml-2 h-4 border-r border-gray-300" />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 pl-3 pr-2 text-sm font-medium flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Avatar className="h-7 w-7 border border-gray-200">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 overflow-hidden rounded-xl p-1.5">
                  <div className="p-2 mb-1.5">
                    <div className="text-sm font-medium">{user.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer py-1.5 pl-2 gap-2">
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer py-1.5 pl-2 gap-2">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer py-1.5 pl-2 gap-2">
                    <Link to="/lead-gen" className="flex items-center">
                      <LineChart className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Lead Generation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer py-1.5 pl-2 gap-2">
                    <Link to="/leads" className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Saved Leads</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer py-1.5 pl-2 gap-2"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full px-4">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full px-4 hover:shadow-md transition-all"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-25"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute inset-x-0 top-16 bg-white shadow-lg border-b border-gray-200 transition-all duration-200 ease-in-out transform origin-top z-40",
          isMenuOpen 
            ? "opacity-100 scale-y-100 translate-y-0" 
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="p-4 space-y-3 divide-y divide-gray-100">
          <div className="space-y-2 pb-3">
            <MobileNavLink to="/" active={isActive('/')} icon={<Home className="h-4 w-4" />}>
              Home
            </MobileNavLink>
            
            {user && (
              <>
                <MobileNavLink to="/dashboard" active={isActive('/dashboard')} icon={<User className="h-4 w-4" />}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/profile" active={isActive('/profile')} icon={<User className="h-4 w-4" />}>
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/lead-gen" active={isActive('/lead-gen')} icon={<LineChart className="h-4 w-4" />}>
                  Lead Generation
                </MobileNavLink>
                <MobileNavLink to="/leads" active={isActive('/leads')} icon={<Database className="h-4 w-4" />}>
                  Saved Leads
                </MobileNavLink>
              </>
            )}
          </div>
          
          {user ? (
            <div className="pt-3">
              <div className="flex items-center mb-3 px-1">
                <Avatar className="h-8 w-8 mr-3 border border-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="pt-3 flex flex-col space-y-2">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button 
                  className="w-full justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 hover:shadow-md transition-all"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop navigation link
const NavLink = ({ 
  to, 
  active, 
  children 
}: { 
  to: string; 
  active: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-sm rounded-full flex items-center font-medium transition-all",
        active
          ? "bg-indigo-50 text-indigo-700" 
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
};

// Mobile navigation link
const MobileNavLink = ({ 
  to, 
  active, 
  icon,
  children 
}: { 
  to: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2.5 text-base font-medium rounded-lg",
        active
          ? "bg-indigo-50 text-indigo-700" 
          : "text-gray-700 hover:bg-gray-50"
      )}
    >
      <span className={cn(
        "mr-3",
        active ? "text-indigo-600" : "text-gray-500"
      )}>
        {icon}
      </span>
      {children}
    </Link>
  );
};

export default Navbar;
