import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl relative">
              <span className="animate-gradient-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 
                bg-[size:400%] bg-clip-text text-transparent">
                MapHarvest
              </span>
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
