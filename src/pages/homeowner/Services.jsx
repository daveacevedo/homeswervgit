import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  StarIcon, 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const HomeownerServices = () => {
  const { user } = useAuth();
  const { userProfile } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filterDistance, setFilterDistance] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch services from your database
      // For demo purposes, we'll use mock data
      
      // Mock services data
      const mockServices = [
        {
          id: 1,
          name: 'Elite Home Renovations',
          category: 'general_contractor',
          category_name: 'General Contractor',
          description: 'Full-service home renovation company specializing in kitchens, bathrooms, and whole-house remodels.',
          rating: 4.8,
          reviews_count: 124,
          hourly_rate: 85,
          distance: 3.2,
          verified: true,
          available: true,
          image: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Seattle, WA',
          phone: '(206) 555-1234',
          email: 'info@elitehomerenovations.com'
        },
        {
          id: 2,
          name: 'Modern Plumbing Solutions',
          category: 'plumbing',
          category_name: 'Plumbing',
          description: 'Professional plumbing services for residential and commercial properties. Available 24/7 for emergencies.',
          rating: 4.6,
          reviews_count: 89,
          hourly_rate: 95,
          distance: 5.7,
          verified: true,
          available: true,
          image: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Bellevue, WA',
          phone: '(425) 555-5678',
          email: 'service@modernplumbing.com'
        },
        {
          id: 3,
          name: 'Perfect Painting Co.',
          category: 'painting',
          category_name: 'Painting',
          description: 'Interior and exterior painting services with premium paints and expert application techniques.',
          rating: 5.0,
          reviews_count: 56,
          hourly_rate: 65,
          distance: 2.1,
          verified: true,
          available: false,
          image: 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Redmond, WA',
          phone: '(425) 555-9012',
          email: 'info@perfectpainting.com'
        },
        {
          id: 4,
          name: 'Green Thumb Landscaping',
          category: 'landscaping',
          category_name: 'Landscaping',
          description: 'Complete landscaping services including design, installation, maintenance, and seasonal clean-up.',
          rating: 4.7,
          reviews_count: 112,
          hourly_rate: 75,
          distance: 8.4,
          verified: true,
          available: true,
          image: 'https://images.pexels.com/photos/589/garden-grass-lawn-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Kirkland, WA',
          phone: '(425) 555-3456',
          email: 'service@greenthumb.com'
        },
        {
          id: 5,
          name: 'Sparky Electrical Services',
          category: 'electrical',
          category_name: 'Electrical',
          description: 'Licensed electricians providing residential and commercial electrical services, from repairs to full installations.',
          rating: 4.5,
          reviews_count: 78,
          hourly_rate: 90,
          distance: 4.3,
          verified: true,
          available: true,
          image: 'https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Seattle, WA',
          phone: '(206) 555-7890',
          email: 'info@sparkyelectrical.com'
        },
        {
          id: 6,
          name: 'Top Notch Roofing',
          category: 'roofing',
          category_name: 'Roofing',
          description: 'Roof installation, repair, and maintenance services with quality materials and workmanship guarantee.',
          rating: 4.9,
          reviews_count: 67,
          hourly_rate: 80,
          distance: 12.6,
          verified: false,
          available: true,
          image: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Renton, WA',
          phone: '(425) 555-2345',
          email: 'service@topnotchroofing.com'
        },
        {
          id: 7,
          name: 'Comfort HVAC Systems',
          category: 'hvac',
          category_name: 'HVAC',
          description: 'Heating, ventilation, and air conditioning services including installation, repair, and maintenance.',
          rating: 4.4,
          reviews_count: 93,
          hourly_rate: 85,
          distance: 6.8,
          verified: true,
          available: true,
          image: 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Bellevue, WA',
          phone: '(425) 555-6789',
          email: 'info@comforthvac.com'
        },
        {
          id: 8,
          name: 'Precision Carpentry',
          category: 'carpentry',
          category_name: 'Carpentry',
          description: 'Custom carpentry work including cabinets, built-ins, trim work, and furniture making.',
          rating: 4.7,
          reviews_count: 45,
          hourly_rate: 70,
          distance: 9.2,
          verified: true,
          available: false,
          image: 'https://images.pexels.com/photos/3637837/pexels-photo-3637837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          location: 'Issaquah, WA',
          phone: '(425) 555-0123',
          email: 'info@precisioncarpentry.com'
        }
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      // Mock categories data
      const mockCategories = [
        { id: 'general_contractor', name: 'General Contractor' },
        { id: 'plumbing', name: 'Plumbing' },
        { id: 'electrical', name: 'Electrical' },
        { id: 'hvac', name: 'HVAC' },
        { id: 'roofing', name: 'Roofing' },
        { id: 'painting', name: 'Painting' },
        { id: 'landscaping', name: 'Landscaping' },
        { id: 'carpentry', name: 'Carpentry' }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  // Filter services based on category, search term, and distance
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistance = service.distance <= filterDistance;
    
    return matchesCategory && matchesSearch && matchesDistance;
  });
  
  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'distance') {
      return a.distance - b.distance;
    } else if (sortBy === 'price') {
      return a.hourly_rate - b.hourly_rate;
    }
    return 0;
  });
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        <StarIcon 
          className={`h-5 w-5 ${rating >= 1 ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={rating >= 1 ? 'currentColor' : 'none'} 
        />
        <StarIcon 
          className={`h-5 w-5 ${rating >= 2 ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={rating >= 2 ? 'currentColor' : 'none'} 
        />
        <StarIcon 
          className={`h-5 w-5 ${rating >= 3 ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={rating >= 3 ? 'currentColor' : 'none'} 
        />
        <StarIcon 
          className={`h-5 w-5 ${rating >= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={rating >= 4 ? 'currentColor' : 'none'} 
        />
        <StarIcon 
          className={`h-5 w-5 ${rating >= 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill={rating >= 5 ? 'currentColor' : 'none'} 
        />
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Find Service Providers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect with trusted professionals for your home improvement and maintenance needs.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {/* Search and filter section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search service providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <AdjustmentsHorizontalIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Filters
              </button>
              <select
                id="sort"
                name="sort"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="distance">Sort by Distance</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Service Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                    Distance (miles): {filterDistance}
                  </label>
                  <input
                    type="range"
                    id="distance"
                    name="distance"
                    min="1"
                    max="100"
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="available-now"
                        name="availability"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="available-now" className="ml-2 block text-sm text-gray-700">
                        Available Now
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="verified"
                        name="verified"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                        Verified Providers Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Category pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Results count */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Showing {sortedServices.length} service providers
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>
        
        {/* Service providers grid */}
        <div className="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedServices.length > 0 ? (
            sortedServices.map((service) => (
              <div key={service.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-blue-600">{service.category_name}</p>
                    </div>
                    {service.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckBadgeIcon className="mr-1 h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    {renderStarRating(service.rating)}
                    <span className="text-sm text-gray-500 ml-2">({service.reviews_count} reviews)</span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{service.location} ({service.distance.toFixed(1)} miles away)</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{service.phone}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{service.available ? 'Available Now' : 'Currently Booked'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(service.hourly_rate)}/hour
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
              No service providers found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
        
        {/* Featured service providers */}
        {sortedServices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900">Featured Service Providers</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0">
                    <img
                      className="h-32 w-32 rounded-lg object-cover"
                      src="https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Elite Home Renovations"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Elite Home Renovations</h3>
                        <p className="text-sm text-blue-600">General Contractor</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckBadgeIcon className="mr-1 h-3 w-3" />
                        Top Rated
                      </span>
                    </div>
                    <div className="mt-2 flex items-center">
                      {renderStarRating(4.8)}
                      <span className="text-sm text-gray-500 ml-2">(124 reviews)</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Full-service home renovation company specializing in kitchens, bathrooms, and whole-house remodels. With over 15 years of experience, we deliver exceptional craftsmanship and customer service.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Kitchen Remodeling
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Bathroom Renovation
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Home Additions
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Custom Cabinetry
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p className="text-sm text-gray-500">Seattle, WA (3.2 miles away)</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Request Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Need help finding a provider */}
        <div className="mt-12 bg-blue-50 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-blue-900">Need help finding the right service provider?</h3>
            <div className="mt-2 max-w-xl text-sm text-blue-700">
              <p>
                Let us match you with qualified professionals based on your specific project requirements.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Personalized Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerServices;
