import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'hvac', name: 'HVAC' },
  { id: 'roofing', name: 'Roofing' },
  { id: 'landscaping', name: 'Landscaping' },
  { id: 'painting', name: 'Painting' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'renovation', name: 'Renovation' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'flooring', name: 'Flooring' },
  { id: 'pest_control', name: 'Pest Control' }
];

const Providers = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [savedProviders, setSavedProviders] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'saved'
  
  useEffect(() => {
    if (user) {
      fetchProviders();
      fetchSavedProviders();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // If no data, use mock data
      const mockProviders = [
        {
          id: 'prov-1',
          name: 'Ace Plumbing & Remodeling',
          category: 'plumbing',
          rating: 4.8,
          reviewCount: 124,
          description: 'Professional plumbing services with over 20 years of experience. Specializing in repairs, installations, and bathroom remodeling.',
          address: '123 Main St, Austin, TX 78701',
          phone: '(512) 555-1234',
          email: 'info@aceplumbing.com',
          website: 'www.aceplumbing.com',
          verified: true,
          yearsInBusiness: 22,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Leak Detection & Repair',
            'Pipe Installation & Replacement',
            'Bathroom Remodeling',
            'Water Heater Services',
            'Drain Cleaning'
          ],
          availability: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm'
        },
        {
          id: 'prov-2',
          name: 'Green Thumb Landscaping',
          category: 'landscaping',
          rating: 4.6,
          reviewCount: 89,
          description: 'Complete landscaping services for residential and commercial properties. From lawn maintenance to custom landscape design.',
          address: '456 Oak Dr, Austin, TX 78704',
          phone: '(512) 555-5678',
          email: 'contact@greenthumb.com',
          website: 'www.greenthumblandscaping.com',
          verified: true,
          yearsInBusiness: 15,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Lawn Maintenance',
            'Landscape Design',
            'Irrigation Systems',
            'Tree & Shrub Care',
            'Hardscaping'
          ],
          availability: 'Mon-Sat: 7am-5pm'
        },
        {
          id: 'prov-3',
          name: 'Bright Spark Electric',
          category: 'electrical',
          rating: 4.9,
          reviewCount: 156,
          description: 'Licensed electricians providing residential and commercial electrical services. From simple repairs to complete rewiring.',
          address: '789 Elm St, Austin, TX 78745',
          phone: '(512) 555-9012',
          email: 'service@brightspark.com',
          website: 'www.brightsparkelectric.com',
          verified: true,
          yearsInBusiness: 18,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/8961292/pexels-photo-8961292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Electrical Repairs',
            'Panel Upgrades',
            'Lighting Installation',
            'Ceiling Fan Installation',
            'Electrical Inspections'
          ],
          availability: 'Mon-Fri: 8am-5pm, 24/7 Emergency Service'
        },
        {
          id: 'prov-4',
          name: 'Top Notch Roofing',
          category: 'roofing',
          rating: 4.7,
          reviewCount: 112,
          description: 'Quality roofing services including repairs, replacements, and inspections. Serving the Austin area for over 25 years.',
          address: '321 Cedar Rd, Austin, TX 78702',
          phone: '(512) 555-3456',
          email: 'info@topnotchroofing.com',
          website: 'www.topnotchroofing.com',
          verified: true,
          yearsInBusiness: 25,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Roof Repairs',
            'Roof Replacement',
            'Roof Inspections',
            'Gutter Installation',
            'Storm Damage Repair'
          ],
          availability: 'Mon-Fri: 7am-6pm, Sat: 8am-2pm'
        },
        {
          id: 'prov-5',
          name: 'Cool Breeze HVAC',
          category: 'hvac',
          rating: 4.5,
          reviewCount: 78,
          description: 'Heating, ventilation, and air conditioning services for residential and commercial properties. Installation, repair, and maintenance.',
          address: '567 Pine St, Austin, TX 78703',
          phone: '(512) 555-7890',
          email: 'service@coolbreeze.com',
          website: 'www.coolbreezehvac.com',
          verified: true,
          yearsInBusiness: 12,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/4491881/pexels-photo-4491881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'AC Installation & Repair',
            'Heating System Services',
            'Duct Cleaning',
            'Preventative Maintenance',
            'Indoor Air Quality Solutions'
          ],
          availability: 'Mon-Fri: 8am-5pm, 24/7 Emergency Service'
        },
        {
          id: 'prov-6',
          name: 'Fresh Coat Painters',
          category: 'painting',
          rating: 4.4,
          reviewCount: 65,
          description: 'Professional interior and exterior painting services for homes and businesses. Quality workmanship and attention to detail.',
          address: '890 Maple Ave, Austin, TX 78722',
          phone: '(512) 555-2345',
          email: 'info@freshcoat.com',
          website: 'www.freshcoatpainters.com',
          verified: false,
          yearsInBusiness: 8,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/6368836/pexels-photo-6368836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Interior Painting',
            'Exterior Painting',
            'Cabinet Refinishing',
            'Deck & Fence Staining',
            'Color Consultation'
          ],
          availability: 'Mon-Sat: 8am-6pm'
        },
        {
          id: 'prov-7',
          name: 'Spotless Cleaning Services',
          category: 'cleaning',
          rating: 4.3,
          reviewCount: 92,
          description: 'Comprehensive cleaning services for homes and offices. Regular maintenance, deep cleaning, and move-in/move-out services.',
          address: '432 Birch St, Austin, TX 78705',
          phone: '(512) 555-6789',
          email: 'schedule@spotlesscleaning.com',
          website: 'www.spotlesscleaningservices.com',
          verified: false,
          yearsInBusiness: 6,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Regular Maintenance Cleaning',
            'Deep Cleaning',
            'Move-In/Move-Out Cleaning',
            'Post-Construction Cleaning',
            'Window Cleaning'
          ],
          availability: 'Mon-Fri: 8am-5pm, Sat: 9am-3pm'
        },
        {
          id: 'prov-8',
          name: 'Master Carpentry',
          category: 'carpentry',
          rating: 4.8,
          reviewCount: 47,
          description: 'Custom carpentry and woodworking services. Specializing in built-ins, custom furniture, and finish carpentry.',
          address: '765 Walnut Dr, Austin, TX 78723',
          phone: '(512) 555-0123',
          email: 'info@mastercarpentry.com',
          website: 'www.mastercarpentry.com',
          verified: true,
          yearsInBusiness: 20,
          licensedInsured: true,
          image: 'https://images.pexels.com/photos/3637837/pexels-photo-3637837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          services: [
            'Custom Cabinetry',
            'Built-In Shelving',
            'Finish Carpentry',
            'Custom Furniture',
            'Deck Construction'
          ],
          availability: 'Mon-Fri: 8am-5pm'
        }
      ];
      
      const providersData = data && data.length > 0 ? data : mockProviders;
      setProviders(providersData);
      setFilteredProviders(providersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setLoading(false);
    }
  };
  
  const fetchSavedProviders = async () => {
    try {
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const { data, error } = await supabase
        .from('saved_providers')
        .select('provider_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // If no data, use mock data
      const savedProviderIds = data && data.length > 0 
        ? data.map(item => item.provider_id) 
        : ['prov-1', 'prov-3']; // Mock saved providers
      
      setSavedProviders(savedProviderIds);
    } catch (error) {
      console.error('Error fetching saved providers:', error);
    }
  };
  
  useEffect(() => {
    // Filter providers based on search term, category, and rating
    let filtered = providers;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(term) ||
        provider.description.toLowerCase().includes(term) ||
        provider.services.some(service => service.toLowerCase().includes(term))
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(provider => provider.category === categoryFilter);
    }
    
    // Filter by rating
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(provider => provider.rating >= minRating);
    }
    
    // Filter by saved status if in saved view
    if (viewMode === 'saved') {
      filtered = filtered.filter(provider => savedProviders.includes(provider.id));
    }
    
    setFilteredProviders(filtered);
  }, [searchTerm, categoryFilter, ratingFilter, providers, viewMode, savedProviders]);
  
  const toggleSaveProvider = async (providerId) => {
    try {
      const isSaved = savedProviders.includes(providerId);
      
      if (isSaved) {
        // Remove from saved providers
        await supabase
          .from('saved_providers')
          .delete()
          .eq('user_id', user.id)
          .eq('provider_id', providerId);
        
        setSavedProviders(prev => prev.filter(id => id !== providerId));
      } else {
        // Add to saved providers
        await supabase
          .from('saved_providers')
          .insert([
            { user_id: user.id, provider_id: providerId }
          ]);
        
        setSavedProviders(prev => [...prev, providerId]);
      }
    } catch (error) {
      console.error('Error toggling saved provider:', error);
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Service Providers
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Find and connect with trusted home service professionals
          </p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search providers
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search by name, service, or description"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <label htmlFor="category" className="sr-only">
                Filter by category
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="md:w-48">
              <label htmlFor="rating" className="sr-only">
                Filter by rating
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <StarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="rating"
                  name="rating"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewMode === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Providers
            </button>
            <button
              onClick={() => setViewMode('saved')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewMode === 'saved'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Saved Providers
            </button>
          </div>
        </div>
      </div>
      
      {/* Provider List */}
      <div className="space-y-6">
        {filteredProviders.length === 0 ? (
          <div className="bg-white shadow sm:rounded-lg py-12 text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {viewMode === 'saved' 
                ? "You haven't saved any providers yet."
                : "Try adjusting your filters or search terms."}
            </p>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48">
                  <img
                    className="h-full w-full object-cover md:h-full md:w-full"
                    src={provider.image}
                    alt={provider.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Provider';
                    }}
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {provider.name}
                        {provider.verified && (
                          <CheckBadgeIcon className="ml-1 inline-block h-5 w-5 text-primary-600" aria-hidden="true" title="Verified Provider" />
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{getCategoryName(provider.category)}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={`${
                              provider.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                            } h-5 w-5 flex-shrink-0`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-2 text-sm text-gray-700">
                        {provider.rating} ({provider.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-500">{provider.description}</p>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Services</h4>
                      <ul className="mt-2 text-sm text-gray-500 space-y-1">
                        {provider.services.slice(0, 3).map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                        {provider.services.length > 3 && (
                          <li>+{provider.services.length - 3} more services</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p className="flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {provider.address}
                        </p>
                        <p className="flex items-center">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {provider.phone}
                        </p>
                        <p className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {provider.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{provider.yearsInBusiness} years</span> in business
                      {provider.licensedInsured && (
                        <span className="ml-2">• Licensed & Insured</span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleSaveProvider(provider.id)}
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          savedProviders.includes(provider.id)
                            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {savedProviders.includes(provider.id) ? 'Saved' : 'Save'}
                      </button>
                      <Link
                        to={`/homeowner/messages?provider=${provider.id}`}
                        className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <ChatBubbleLeftRightIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Providers;
