import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  useEffect(() => {
    document.title = 'Pricing | NextLead';
    detectUserCountry();
  }, []);

  const [annual, setAnnual] = useState(true);
  const [isIndianUser, setIsIndianUser] = useState(false);
  
  // Exchange rate (approximated, in practice would be fetched from an API)
  const exchangeRate = 83;

  // Function to detect user's country
  const detectUserCountry = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setIsIndianUser(data.country_code === 'IN');
    } catch (error) {
      console.error('Error detecting country:', error);
      // Default to USD if there's an error
      setIsIndianUser(false);
    }
  };

  // Function to format currency based on user's location
  const formatCurrency = (amount) => {
    if (isIndianUser) {
      // Convert to INR and format
      const inrAmount = Math.round(amount * exchangeRate);
      return `₹${inrAmount}`;
    } else {
      // Format as USD
      return `$${amount}`;
    }
  };

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals just getting started',
      price: annual ? 19 : 25,
      features: [
        '100 leads per month',
        'Basic lead filtering',
        'Email support',
        'CSV exports',
        'Single user'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      price: annual ? 49 : 59,
      features: [
        '500 leads per month',
        'Advanced filtering',
        'Priority email support',
        'Data enrichment',
        'Up to 3 users',
        'API access'
      ],
      cta: 'Get Started',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For larger teams with advanced needs',
      price: annual ? 99 : 119,
      features: [
        'Unlimited leads',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'Unlimited users',
        'White labeling',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                alt="Business growth chart"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Transparent Pricing</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-100 sm:max-w-3xl">
                Choose the plan that fits your needs. All plans include core features with no hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:text-center">
          <div className="mt-8 flex justify-center">
            <div className="relative bg-gray-100 p-1 rounded-full flex">
              <button
                onClick={() => setAnnual(true)}
                className={`relative py-2 px-6 text-sm font-medium rounded-full transition-all duration-300 ${
                  annual
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700'
                }`}
              >
                Annual
                <span className={`${annual ? 'block' : 'hidden'} absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800`}>
                  Save 20%
                </span>
              </button>
              <button
                onClick={() => setAnnual(false)}
                className={`relative py-2 px-6 text-sm font-medium rounded-full transition-all duration-300 ${
                  !annual
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          {isIndianUser && (
            <p className="mt-4 text-sm text-gray-500">
              Prices shown in Indian Rupees (₹). {annual ? 'Billed annually.' : 'Billed monthly.'}
            </p>
          )}
          {!isIndianUser && (
            <p className="mt-4 text-sm text-gray-500">
              Prices shown in US Dollars ($). {annual ? 'Billed annually.' : 'Billed monthly.'}
            </p>
          )}
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 md:max-w-4xl md:mx-auto md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.highlighted
                  ? 'border-2 border-indigo-500 transform scale-105 z-10'
                  : 'border border-gray-200'
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">{formatCurrency(plan.price)}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                  {annual && <span className="text-sm text-gray-500 ml-1">billed annually</span>}
                </p>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`mt-6 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-sm font-medium text-gray-900">What's included</h3>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg py-10 px-6 sm:px-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I change plans later?</h3>
              <p className="mt-2 text-base text-gray-500">
                Yes, you can upgrade or downgrade your plan at any time. Prorated credits will be applied to your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you offer a free trial?</h3>
              <p className="mt-2 text-base text-gray-500">
                Yes, all plans come with a 14-day free trial. No credit card required to get started.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-base text-gray-500">
                We accept all major credit cards, PayPal, and wire transfers for annual plans.
                {isIndianUser && ' We also support UPI and NetBanking for Indian customers.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 