import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { ShareIcon, HomeIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const RealEstateMarketplace = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Sample FSBO listings data
  const fsboListings = [
    {
      id: 1,
      title: "Modern 3BR Ranch with Updated Kitchen",
      address: "123 Lakeview Dr, Clermont, FL 34711",
      price: 349000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      description: "Beautiful ranch-style home with open floor plan, updated kitchen with stainless steel appliances, and large backyard with patio.",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      listedDate: "2023-10-15",
      shareCount: 24
    },
    {
      id: 2,
      title: "Waterfront 4BR Home with Dock Access",
      address: "456 Shoreline Ave, Mount Dora, FL 32757",
      price: 525000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
      description: "Stunning waterfront property with private dock, updated throughout with modern finishes, and breathtaking lake views from multiple rooms.",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      listedDate: "2023-10-02",
      shareCount: 37
    },
    {
      id: 3,
      title: "Renovated 2BR Cottage Near Downtown",
      address: "789 Oak St, Eustis, FL 32726",
      price: 275000,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1200,
      description: "Charming cottage completely renovated with modern amenities while maintaining its historic character. Walking distance to downtown shops and restaurants.",
      image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      listedDate: "2023-10-10",
      shareCount: 18
    }
  ];

  // Sample real estate notes data
  const realEstateNotes = [
    {
      id: 1,
      title: "First Position Mortgage Note - Single Family Home",
      propertyAddress: "123 Pine St, Tavares, FL 32778",
      originalAmount: 200000,
      currentBalance: 175000,
      interestRate: 6.5,
      monthlyPayment: 1264.14,
      remainingTerm: 276, // months
      askingPrice: 157500,
      description: "First position mortgage note on well-maintained single family home. Borrower has perfect payment history for 4 years.",
      image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      title: "Owner-Financed Duplex Note",
      propertyAddress: "456 Lake Ave, Leesburg, FL 34748",
      originalAmount: 250000,
      currentBalance: 235000,
      interestRate: 7.0,
      monthlyPayment: 1663.26,
      remainingTerm: 324, // months
      askingPrice: 211500,
      description: "Owner-financed note on cash-flowing duplex. Both units currently rented with long-term tenants.",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Real Estate"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Real Estate Marketplace
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Buy and sell properties directly, share listings with your network, or invest in real estate notes - all without the traditional high commission fees.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/real-estate/list-property"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              List Your Property
            </Link>
            <Link
              to="/real-estate/how-it-works"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-gray-800"
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tab.Group onChange={setSelectedTab}>
          <Tab.List className="flex p-1 space-x-1 bg-blue-50 rounded-xl mb-8">
            <Tab
              className={({ selected }) =>
                `w-full py-3 text-sm leading-5 font-medium rounded-lg
                ${selected ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`
              }
            >
              <div className="flex items-center justify-center">
                <HomeIcon className="w-5 h-5 mr-2" />
                FSBO Listings
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-3 text-sm leading-5 font-medium rounded-lg
                ${selected ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`
              }
            >
              <div className="flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Real Estate Notes
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-3 text-sm leading-5 font-medium rounded-lg
                ${selected ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`
              }
            >
              <div className="flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Find a Realtor
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* FSBO Listings Panel */}
            <Tab.Panel>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">For Sale By Owner Listings</h2>
                <p className="text-gray-600 mb-6">
                  Browse homes listed directly by owners. Save on commission fees and connect directly with sellers.
                  On average, FSBO sellers save $17,500-$21,000 in commission fees on a typical Lake County home sale.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fsboListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48">
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md font-medium">
                          {formatCurrency(listing.price)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{listing.address}</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-3">
                          <span>{listing.bedrooms} beds</span>
                          <span>{listing.bathrooms} baths</span>
                          <span>{listing.sqft.toLocaleString()} sqft</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                        <div className="flex justify-between items-center">
                          <Link 
                            to={`/real-estate/listing/${listing.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Details
                          </Link>
                          <button 
                            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600"
                            title="Share this listing"
                          >
                            <ShareIcon className="h-5 w-5 mr-1" />
                            <span>{listing.shareCount}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    to="/real-estate/fsbo-listings"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    View All Listings
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">List Your Property For Free</h3>
                    <p className="text-gray-600 mb-4">
                      Save thousands in commission fees by listing your property directly. 
                      Our platform helps you reach potential buyers and neighbors who can share your listing.
                    </p>
                    <ul className="text-gray-600 mb-4 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Free listing with photos and detailed description</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Social sharing tools to reach neighbors and networks</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Optional realtor referral if your home doesn't sell</span>
                      </li>
                    </ul>
                    <Link
                      to="/real-estate/list-property"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      List Your Property
                    </Link>
                  </div>
                  <div className="md:w-1/3">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Average Savings</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Median Home Price in Lake County</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(350000)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Traditional 6% Commission</p>
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(21000)}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-500">Your Potential Savings</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(21000)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Real Estate Notes Panel */}
            <Tab.Panel>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Real Estate Notes Marketplace</h2>
                <p className="text-gray-600 mb-6">
                  Buy and sell real estate notes, including owner-financed mortgages and private loans secured by real estate.
                  This marketplace connects note holders looking for liquidity with investors seeking passive income opportunities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {realEstateNotes.map((note) => (
                    <div key={note.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img 
                            src={note.image} 
                            alt={note.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{note.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{note.propertyAddress}</p>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                            <div>
                              <p className="text-gray-500">Current Balance</p>
                              <p className="font-medium">{formatCurrency(note.currentBalance)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Interest Rate</p>
                              <p className="font-medium">{note.interestRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Monthly Payment</p>
                              <p className="font-medium">${note.monthlyPayment}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Remaining Term</p>
                              <p className="font-medium">{Math.floor(note.remainingTerm / 12)} years {note.remainingTerm % 12} months</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-500 text-sm">Asking Price</p>
                              <p className="text-xl font-bold text-blue-600">{formatCurrency(note.askingPrice)}</p>
                            </div>
                            <Link 
                              to={`/real-estate/note/${note.id}`}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Sell Your Real Estate Note</h3>
                  <p className="text-gray-600 mb-4">
                    If you're holding an owner-financed mortgage or other real estate note and need cash now,
                    you can list your note for sale to our network of investors.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-blue-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">Immediate Cash</h4>
                      <p className="text-sm text-gray-600">Convert your future payments into a lump sum now</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-blue-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">Secure Process</h4>
                      <p className="text-sm text-gray-600">Our platform ensures secure transactions and documentation</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-blue-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">Competitive Offers</h4>
                      <p className="text-sm text-gray-600">Connect with multiple investors to get the best price</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link
                      to="/real-estate/list-note"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      List Your Note
                    </Link>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Realtor Referral Panel */}
            <Tab.Panel>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Realtor Referral Network</h2>
                <p className="text-gray-600 mb-6">
                  If you prefer to work with a professional realtor or your FSBO listing hasn't sold,
                  we can connect you with top-performing agents in your area who specialize in your property type.
                </p>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">How Our Realtor Referral Works</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 rounded-full p-4 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">1. Complete a Short Form</h4>
                        <p className="text-gray-600 text-sm">Tell us about your property and your selling goals</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 rounded-full p-4 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">2. Get Matched with Top Agents</h4>
                        <p className="text-gray-600 text-sm">We'll connect you with 2-3 high-performing agents in your area</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 rounded-full p-4 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">3. Choose Your Preferred Agent</h4>
                        <p className="text-gray-600 text-sm">Interview the agents and select the one that best fits your needs</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <p className="text-gray-600 mb-4">
                        Our service is free to you. If you sell your home with a referred agent, we receive a portion of their commission,
                        which doesn't affect your proceeds from the sale.
                      </p>
                      <Link
                        to="/real-estate/realtor-referral"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Request a Realtor Referral
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Why Consider a Realtor?</h3>
                      <p className="text-gray-600 mb-4">
                        While FSBO can save on commission, working with a professional realtor offers several advantages:
                      </p>
                      <ul className="text-gray-600 space-y-2 mb-4">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Access to the Multiple Listing Service (MLS) for maximum exposure</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Professional marketing materials and photography</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Negotiation expertise to maximize your sale price</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Handling of complex paperwork and legal requirements</span>
                        </li>
                      </ul>
                    </div>
                    <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Success Rate Comparison</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">FSBO Success Rate</span>
                            <span className="text-sm font-medium text-gray-700">12%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Realtor Success Rate</span>
                            <span className="text-sm font-medium text-gray-700">88%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          *Based on National Association of Realtors data comparing FSBO vs. agent-assisted sales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions about our real estate marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How much can I save by selling FSBO?</h3>
              <p className="text-gray-600">
                On average, homeowners can save 5-6% of their home's sale price by selling FSBO. 
                For a $350,000 home in Lake County, that's approximately $17,500-$21,000 in savings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">What happens if my FSBO listing doesn't sell?</h3>
              <p className="text-gray-600">
                If your FSBO listing doesn't attract buyers, you can request a realtor referral through our platform. 
                We'll connect you with top-performing agents in your area who can list your property on the MLS.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How does the social sharing feature work?</h3>
              <p className="text-gray-600">
                Our platform allows you to easily share your listing on social networks like Facebook and Nextdoor. 
                You can also invite neighbors to share your listing with their networks, increasing visibility by 20-30%.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">What are real estate notes and why would I sell them?</h3>
              <p className="text-gray-600">
                Real estate notes are loans secured by property, such as owner-financed mortgages. Selling a note converts 
                future payments into immediate cash, which can be useful if you need liquidity for other investments or expenses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to list your property?</span>
            <span className="block text-blue-200">Join our real estate marketplace today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/real-estate/list-property"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                List Your Property
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/real-estate/how-it-works"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateMarketplace;
