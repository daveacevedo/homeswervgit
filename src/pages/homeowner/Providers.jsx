import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Providers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Elite Cabinets & Countertops',
      category: 'Kitchen Remodeling',
      rating: 4.8,
      reviews: 124,
      description: 'Specializing in custom cabinets and premium countertop installation with over 15 years of experience.',
      image: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'Denver, CO',
      distance: '3.2 miles',
      verified: true,
      favorite: true
    },
    {
      id: 2,
      name: 'Modern Plumbing Solutions',
      category: 'Plumbing',
      rating: 4.6,
      reviews: 89,
      description: 'Licensed plumbers providing residential and commercial services including repairs, installations, and maintenance.',
      image: 'https://images.pexels.com/photos/8486972/pexels-photo-8486972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'Denver, CO',
      distance: '5.7 miles',
      verified: true,
      favorite: false
    },
    {
      id: 3,
      name: 'Luxury Baths & Tiles',
      category: 'Bathroom Remodeling',
      rating: 4.9,
      reviews: 156,
      description: 'Transform your bathroom with our premium remodeling services. Specializing in luxury fixtures and custom tile work.',
      image: 'https://images.pexels.com/photos/6585758/pexels-photo-6585758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'Boulder, CO',
      distance: '12.4 miles',
      verified: true,
      favorite: true
    },
    {
      id: 4,
      name: 'Outdoor Living Pros',
      category: 'Landscaping',
      rating: 4.7,
      reviews: 78,
      description: 'Complete outdoor solutions including decks, patios, landscaping, and garden design for your perfect outdoor space.',
      image: 'https://images.pexels.com/photos/589/garden-grass-meadow-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'Denver, CO',
      distance: '4.1 miles',
      verified: true,
      favorite: false
    },
    {
      id: 5,
      name: 'Bright Electric',
      category: 'Electrical',
      rating: 4.5,
      reviews: 62,
      description: 'Licensed electricians providing residential and commercial electrical services with 24/7 emergency support.',
      image: 'https://images.pexels.com/photos/8961438/pexels-photo-8961438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      location: 'Lakewood, CO',
      distance: '7.8 miles',
      verified: false,
      favorite: false
    }
  ]);

  const categories = [
    'All Categories',
    'Kitchen Remodeling',
    'Bathroom Remodeling',
    'Plumbing',
    'Electrical',
    'Landscaping',
    'Painting',
    'Flooring',
    'Roofing',
    'HVAC'
  ];

  const ratings = [
    { value: '', label: 'Any Rating' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3', label: '3+ Stars' }
  ];

  const toggleFavorite = (id) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, favorite: !provider.favorite } : provider
    ));
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || provider.category === selectedCategory;
    const matchesRating = selectedRating === '' || provider.rating >= parseFloat(selectedRating);
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Service Providers</h1>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="search" className="sr-only">Search providers</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search providers by name or service"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                id="rating"
                name="rating"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                {ratings.map((rating, index) => (
                  <option key={index} value={rating.value}>{rating.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Providers list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img 
                className="w-full h-full object-cover" 
                src={provider.image} 
                alt={provider.name} 
              />
              <button 
                onClick={() => toggleFavorite(provider.id)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white shadow hover:bg-gray-100"
              >
                <svg 
                  className={`h-5 w-5 ${provider.favorite ? 'text-red-500' : 'text-gray-400'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/homeowner/providers/${provider.id}`} className="hover:text-blue-600">
                      {provider.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{provider.category}</p>
                </div>
                {provider.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{provider.rating} ({provider.reviews} reviews)</p>
              </div>
              
              <p className="mt-3 text-sm text-gray-500">{provider.description}</p>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p>{provider.location} • {provider.distance}</p>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={`/homeowner/providers/${provider.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Profile
                </Link>
                <button
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Providers;
