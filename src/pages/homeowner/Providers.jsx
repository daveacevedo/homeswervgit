import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  StarIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const HomeownerProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch providers from your database
      // For demo purposes, we'll use mock data
      
      // Mock providers data
      const mockProviders = [
        {
          id: 101,
          name: 'Michael Brown',
          company: 'Elite Home Renovations',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.9,
          reviews: 27,
          services: ['Kitchen Renovation', 'Bathroom Remodeling', 'Basement Finishing'],
          description: 'Specializing in high-end home renovations with over 15 years of experience. Licensed and insured contractor with a focus on quality craftsmanship.',
          location: 'Anytown, CA',
          phone: '(555) 123-4567',
          email: 'michael@elitehomerenovations.com',
          website: 'www.elitehomerenovations.com',
          projects_completed: 124
        },
        {
          id: 102,
          name: 'Jennifer Garcia',
          company: 'Premium Bathroom Solutions',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.8,
          reviews: 19,
          services: ['Bathroom Remodeling', 'Plumbing', 'Tile Work'],
          description: 'Bathroom renovation specialist with expertise in modern designs and water-efficient fixtures. Creating beautiful and functional bathrooms for over a decade.',
          location: 'Somewhere, CA',
          phone: '(555) 234-5678',
          email: 'jennifer@premiumbathrooms.com',
          website: 'www.premiumbathrooms.com',
          projects_completed: 87
        },
        {
          id: 103,
          name: 'David Lee',
          company: 'Outdoor Living Experts',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.7,
          reviews: 15,
          services: ['Deck Building', 'Landscaping', 'Fence Installation'],
          description: 'Transform your outdoor space with custom decks, professional landscaping, and quality fencing. Creating beautiful outdoor living areas that extend your home.',
          location: 'Nowhere, CA',
          phone: '(555) 345-6789',
          email: 'david@outdoorlivingexperts.com',
          website: 'www.outdoorlivingexperts.com',
          projects_completed: 56
        },
        {
          id: 104,
          name: 'Sarah Johnson',
          company: 'Perfect Painting Services',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.9,
          reviews: 32,
          services: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing'],
          description: 'Professional painting services for interior and exterior projects. Attention to detail and premium materials for a flawless finish every time.',
          location: 'Anytown, CA',
          phone: '(555) 456-7890',
          email: 'sarah@perfectpainting.com',
          website: 'www.perfectpainting.com',
          projects_completed: 215
        },
        {
          id: 105,
          name: 'Robert Martinez',
          company: 'Martinez Electrical',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/257886/pexels-photo-257886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.8,
          reviews: 24,
          services: ['Electrical Work', 'Lighting Installation', 'Home Automation'],
          description: 'Licensed electrician providing safe and reliable electrical services. Specializing in modern lighting solutions and smart home technology integration.',
          location: 'Somewhere, CA',
          phone: '(555) 567-8901',
          email: 'robert@martinezelectrical.com',
          website: 'www.martinezelectrical.com',
          projects_completed: 143
        },
        {
          id: 106,
          name: 'Lisa Anderson',
          company: 'Green Thumb Landscaping',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/589/garden-grass-lawn-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.6,
          reviews: 18,
          services: ['Landscaping', 'Garden Design', 'Lawn Care'],
          description: 'Creating beautiful and sustainable outdoor spaces. From complete landscape design to regular maintenance, we help you enjoy your yard year-round.',
          location: 'Nowhere, CA',
          phone: '(555) 678-9012',
          email: 'lisa@greenthumblandscaping.com',
          website: 'www.greenthumblandscaping.com',
          projects_completed: 92
        },
        {
          id: 107,
          name: 'James Wilson',
          company: 'Wilson Roofing & Siding',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.7,
          reviews: 21,
          services: ['Roofing', 'Siding', 'Gutter Installation'],
          description: 'Protect your home with quality roofing and siding services. Experienced team providing durable solutions for all your exterior needs.',
          location: 'Anytown, CA',
          phone: '(555) 789-0123',
          email: 'james@wilsonroofing.com',
          website: 'www.wilsonroofing.com',
          projects_completed: 178
        },
        {
          id: 108,
          name: 'Emily Davis',
          company: 'Custom Cabinetry & Woodwork',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          cover: 'https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          rating: 4.9,
          reviews: 16,
          services: ['Custom Cabinets', 'Woodworking', 'Furniture Making'],
          description: 'Master woodworker creating custom cabinetry, built-ins, and fine furniture. Bringing your vision to life with exceptional craftsmanship and attention to detail.',
          location: 'Somewhere, CA',
          phone: '(555) 890-1234',
          email: 'emily@customcabinetry.com',
          website: 'www.customcabinetry.com',
          projects_completed: 64
        }
      ];
      
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique services
  const allServices = [...new Set(providers.flatMap(provider => provider.services))].sort();

  // Filter providers based on search term, selected service, and rating
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      provider.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = selectedService === 'all' || provider.services.includes(selectedService);
    
    const matchesRating = selectedRating === 'all' || 
      (selectedRating === '5' && provider.rating >= 4.8) ||
      (selectedRating === '4' && provider.rating >= 4.0 && provider.rating < 4.8) ||
      (selectedRating === '3' && provider.rating >= 3.0 && provider.rating < 4.0);
    
    return matchesSearch && matchesService && matchesRating;
  });

  // Helper function to render stars for ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            } ${i === Math.floor(rating) && rating % 1 > 0 ? 'text-yellow-400' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
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
        <h1 className="text-2xl font-semibold text-gray-900">Service Providers</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                    Filter by service
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="all">All Services</option>
                    {allServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Filter by rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">4.8+ Stars</option>
                    <option value="4">4.0+ Stars</option>
                    <option value="3">3.0+ Stars</option>
                  </select>
                </div>
              </div>
              <div className="w-full md:w-64">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-l-md`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-r-md`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Providers display */}
        {viewMode === 'grid' ? (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src={provider.cover}
                      alt={provider.company}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
                    <div className="absolute bottom-4 left-4 flex items-center">
                      <img
                        className="h-12 w-12 rounded-full ring-2 ring-white"
                        src={provider.avatar}
                        alt={provider.name}
                      />
                      <div className="ml-3 text-white">
                        <p className="text-sm font-medium">{provider.name}</p>
                        <p className="text-xs">{provider.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {renderStars(provider.rating)}
                        <span className="ml-1 text-xs text-gray-500">({provider.reviews})</span>
                      </div>
                      <span className="text-xs text-gray-500">{provider.location}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{provider.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {provider.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link
                        to={`/homeowner/providers/${provider.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </Link>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
                No providers found matching your criteria
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <li key={provider.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-16 w-16 rounded-full"
                        src={provider.avatar}
                        alt={provider.name}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                            <p className="text-sm text-gray-500">{provider.company}</p>
                          </div>
                          <div className="flex items-center">
                            {renderStars(provider.rating)}
                            <span className="ml-1 text-xs text-gray-500">({provider.reviews})</span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{provider.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {provider.services.map((service, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{provider.location}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {provider.projects_completed} projects completed
                          </div>
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <PhoneIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                              Call
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <ChatBubbleLeftRightIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                              Message
                            </button>
                            <Link
                              to={`/homeowner/providers/${provider.id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4 text-center text-gray-500">
                  No providers found matching your criteria
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeownerProviders;
