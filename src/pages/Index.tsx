import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Simple Hero Section with Coming Soon */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 md:py-48 flex flex-col items-center justify-center text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-indigo-600" />
            </div>
            
            <div className="inline-flex space-x-2 justify-center">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                Beta
              </span>
            </div>
            
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              MapHarvest
            </h1>
            
            <p className="text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              Generate high-quality business leads by scraping data from Google Maps. Find the right businesses in your target locations with our powerful lead generation tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-md w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-md w-full sm:w-auto">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
