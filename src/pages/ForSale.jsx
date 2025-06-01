import React from 'react';
import { Link } from 'react-router-dom';

const ForSale = () => {
  // Sample properties for sale
  const properties = [
    {
      id: 1,
      title: 'Modern Farmhouse',
      price: '$750,000',
      location: 'Portland, OR',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      description: 'Beautiful modern farmhouse with open floor plan, gourmet kitchen, and large backyard.',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      title: 'Downtown Loft',
      price: '$525,000',
      location: 'Seattle, WA',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1500,
      description: 'Stylish downtown loft with high ceilings, exposed brick, and stunning city views.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 3,
      title: 'Suburban Ranch',
      price: '$450,000',
      location: 'Beaverton, OR',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      description: 'Well-maintained ranch home in quiet neighborhood with updated kitchen and bathrooms.',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 4,
      title: 'Luxury Condo',
      price: '$875,000',
      location: 'Bellevue, WA',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2200,
      description: 'Upscale condo with premium finishes, floor-to-ceiling windows, and building amenities.',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 5,
      title: 'Craftsman Bungalow',
      price: '$625,000',
      location: 'Eugene, OR',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      description: 'Charming craftsman bungalow with original woodwork, built-ins, and updated systems.',
      image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 6,
      title: 'Waterfront Estate',
      price: '$1,250,000',
      location: 'Kirkland, WA',
      bedrooms: 5,
      bathrooms: 4.5,
      sqft: 4200,
      description: 'Stunning waterfront property with private dock, expansive views, and luxury finishes.',
      image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Properties</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Homes For Sale
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Browse our curated selection of properties currently available on the market.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <select
                id="location"
                name="location"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Locations</option>
                <option>Portland, OR</option>
                <option>Seattle, WA</option>
                <option>Beaverton, OR</option>
                <option>Bellevue, WA</option>
                <option>Eugene, OR</option>
                <option>Kirkland, WA</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                id="price"
                name="price"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">Any Price</option>
                <option>Under $500,000</option>
                <option>$500,000 - $750,000</option>
                <option>$750,000 - $1,000,000</option>
                <option>Over $1,000,000</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <select
                id="bedrooms"
                name="bedrooms"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">Any</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
                <option>5+</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="property-type" className="block text-sm font-medium text-gray-700">Property Type</label>
              <select
                id="property-type"
                name="property-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option>House</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Multi-Family</option>
                <option>Land</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Search Properties
            </button>
          </div>
        </div>

        {/* Property Listings */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-4 px-3 py-1 bg-primary-600 rounded-full text-sm font-semibold text-white">
                  {property.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{property.location}</p>
                
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{property.bedrooms} bd</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{property.bathrooms} ba</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{property.description}</p>
                
                <div className="mt-6">
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              aria-current="page"
              className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              8
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              9
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              10
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ForSale;
