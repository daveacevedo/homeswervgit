import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForSale = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    bedrooms: 'any',
    bathrooms: 'any',
    propertyType: 'any',
    sortBy: 'newest'
  });

  // Sample property listings data
  const listings = [
    {
      id: 1,
      title: 'Modern Farmhouse with Pool',
      address: '123 Maple Street, Austin, TX 78701',
      price: 549000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      propertyType: 'Single Family',
      yearBuilt: 2018,
      description: 'Beautiful modern farmhouse with open floor plan, gourmet kitchen, and backyard pool. Perfect for entertaining!',
      features: ['Pool', 'Hardwood Floors', 'Smart Home', 'Energy Efficient'],
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-10-15',
      isFeatured: true,
      isFSBO: true
    },
    {
      id: 2,
      title: 'Downtown Luxury Condo',
      address: '456 Urban Ave, Austin, TX 78702',
      price: 425000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1500,
      propertyType: 'Condo',
      yearBuilt: 2020,
      description: 'Stunning downtown condo with city views, high-end finishes, and building amenities including gym and rooftop terrace.',
      features: ['City Views', 'Concierge', 'Fitness Center', 'Rooftop Deck'],
      images: [
        'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-10-20',
      isFeatured: false,
      isFSBO: true
    },
    {
      id: 3,
      title: 'Charming Craftsman Bungalow',
      address: '789 Oak Lane, Austin, TX 78704',
      price: 675000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      propertyType: 'Single Family',
      yearBuilt: 1935,
      description: 'Beautifully restored craftsman bungalow with original details and modern updates. Walking distance to restaurants and shops.',
      features: ['Original Hardwood', 'Clawfoot Tub', 'Front Porch', 'Mature Trees'],
      images: [
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-10-05',
      isFeatured: true,
      isFSBO: false
    },
    {
      id: 4,
      title: 'Lakefront Property with Dock',
      address: '101 Shoreline Dr, Austin, TX 78730',
      price: 899000,
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3500,
      propertyType: 'Single Family',
      yearBuilt: 2005,
      description: 'Stunning lakefront home with private dock, outdoor kitchen, and panoramic water views from multiple decks.',
      features: ['Waterfront', 'Dock', 'Outdoor Kitchen', 'Multiple Decks'],
      images: [
        'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-09-28',
      isFeatured: false,
      isFSBO: true
    },
    {
      id: 5,
      title: 'Modern Townhouse Near Downtown',
      address: '222 Urban Way, Austin, TX 78702',
      price: 499000,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2100,
      propertyType: 'Townhouse',
      yearBuilt: 2019,
      description: 'Contemporary townhouse with rooftop deck, open concept living, and attached garage. Minutes from downtown.',
      features: ['Rooftop Deck', 'Attached Garage', 'Energy Efficient', 'Smart Home'],
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-10-12',
      isFeatured: false,
      isFSBO: true
    },
    {
      id: 6,
      title: 'Historic Victorian Home',
      address: '333 Heritage Blvd, Austin, TX 78705',
      price: 825000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2900,
      propertyType: 'Single Family',
      yearBuilt: 1895,
      description: 'Meticulously maintained Victorian home with period details, updated systems, and beautiful landscaped yard.',
      features: ['Historic Details', 'Updated Kitchen', 'Wrap-around Porch', 'Carriage House'],
      images: [
        'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      listedDate: '2023-09-30',
      isFeatured: true,
      isFSBO: false
    }
  ];

  // Filter handlers
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Real estate"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            For Sale By Owner
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Browse our curated selection of homes for sale directly from homeowners. No agent fees, just great properties at fair prices.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                id="price-range"
                name="priceRange"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  const value = e.target.value;
                  let range = [0, 1000000];
                  if (value === "0-300000") range = [0, 300000];
                  if (value === "300000-500000") range = [300000, 500000];
                  if (value === "500000-750000") range = [500000, 750000];
                  if (value === "750000-1000000") range = [750000, 1000000];
                  if (value === "1000000+") range = [1000000, 10000000];
                  handleFilterChange('priceRange', range);
                }}
              >
                <option value="any">Any Price</option>
                <option value="0-300000">Under $300,000</option>
                <option value="300000-500000">$300,000 - $500,000</option>
                <option value="500000-750000">$500,000 - $750,000</option>
                <option value="750000-1000000">$750,000 - $1,000,000</option>
                <option value="1000000+">$1,000,000+</option>
              </select>
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <select
                id="bedrooms"
                name="bedrooms"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <select
                id="bathrooms"
                name="bathrooms"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label htmlFor="property-type" className="block text-sm font-medium text-gray-700">Property Type</label>
              <select
                id="property-type"
                name="propertyType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="any">Any</option>
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Land">Land</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                id="sort-by"
                name="sortBy"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="sqft-asc">Square Feet (Low to High)</option>
                <option value="sqft-desc">Square Feet (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Listings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings
              .filter(listing => listing.isFeatured)
              .map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                      Featured
                    </div>
                    {listing.isFSBO && (
                      <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                        FSBO
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.address}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(listing.price)}</p>
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-gray-700">{listing.bedrooms} bd</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{listing.bathrooms} ba</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        <span className="text-gray-700">{listing.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                    <Link
                      to={`/for-sale/${listing.id}`}
                      className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* All Listings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings
              .filter(listing => {
                // Apply filters
                const priceInRange = listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1];
                const bedroomsMatch = filters.bedrooms === 'any' || listing.bedrooms >= parseInt(filters.bedrooms);
                const bathroomsMatch = filters.bathrooms === 'any' || listing.bathrooms >= parseInt(filters.bathrooms);
                const propertyTypeMatch = filters.propertyType === 'any' || listing.propertyType === filters.propertyType;
                
                return priceInRange && bedroomsMatch && bathroomsMatch && propertyTypeMatch;
              })
              .sort((a, b) => {
                // Apply sorting
                if (filters.sortBy === 'newest') {
                  return new Date(b.listedDate) - new Date(a.listedDate);
                } else if (filters.sortBy === 'price-asc') {
                  return a.price - b.price;
                } else if (filters.sortBy === 'price-desc') {
                  return b.price - a.price;
                } else if (filters.sortBy === 'sqft-asc') {
                  return a.sqft - b.sqft;
                } else if (filters.sortBy === 'sqft-desc') {
                  return b.sqft - a.sqft;
                }
                return 0;
              })
              .map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-64 object-cover"
                    />
                    {listing.isFSBO && (
                      <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                        FSBO
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.address}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(listing.price)}</p>
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-gray-700">{listing.bedrooms} bd</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{listing.bathrooms} ba</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        <span className="text-gray-700">{listing.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                    <Link
                      to={`/for-sale/${listing.id}`}
                      className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sell Your Home CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg shadow-lg overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2">
              <img
                className="h-full w-full object-cover"
                src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Selling your home"
              />
            </div>
            <div className="p-8 lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sell Your Home Without the Hassle</h2>
              <p className="text-gray-600 mb-6">
                List your property on Home Swerv and connect directly with potential buyers. No agent fees, no middlemen, just a simple and transparent process.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save thousands in agent commissions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional listing with high-quality photos</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Connect directly with serious buyers</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to legal documents and selling guides</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForSale;
