import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Tab } from '@headlessui/react';
import { StarIcon, CheckBadgeIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProviderDetail = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (providerId) {
      fetchProviderDetails();
    }
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch provider details
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select(`
          *,
          provider_services (
            id,
            service_id,
            price_range,
            services (
              id,
              name,
              description
            )
          )
        `)
        .eq('id', providerId)
        .single();
      
      if (providerError) throw providerError;
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('provider_reviews')
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });
      
      if (reviewsError) throw reviewsError;
      
      // Fetch portfolio items
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('provider_portfolio')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });
      
      if (portfolioError) throw portfolioError;
      
      // Set state with fetched data
      setProvider(providerData);
      setReviews(reviewsData || []);
      setServices(providerData?.provider_services || []);
      setPortfolio(portfolioData || []);
      
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setError('Failed to load provider details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[0, 1, 2, 3, 4].map((star) => (
          <StarIcon
            key={star}
            className={classNames(
              rating > star ? 'text-yellow-400' : 'text-gray-300',
              'h-5 w-5 flex-shrink-0'
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <Link
                to="/providers"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Providers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Provider not found</h3>
        <p className="mt-2 text-sm text-gray-500">The provider you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link
            to="/providers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Provider Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              {provider.logo_url ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={provider.logo_url}
                  alt={provider.business_name}
                />
              ) : (
                <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {provider.business_name}
                {provider.is_verified && (
                  <CheckBadgeIcon className="ml-2 h-6 w-6 text-primary-600" title="Verified Provider" />
                )}
              </h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {renderStars(calculateAverageRating())}
                  <p className="ml-2 text-sm text-gray-700">
                    {calculateAverageRating()} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                {provider.service_area || 'Service area not specified'}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link
              to={`/dashboard/estimate-requests/new?provider=${provider.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Request Estimate
            </Link>
            <Link
              to={`/dashboard/messages/new?provider=${provider.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contact Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200">
          <Tab
            className={({ selected }) =>
              classNames(
                'py-4 px-6 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            Overview
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'py-4 px-6 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            Services
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'py-4 px-6 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            Portfolio
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'py-4 px-6 text-sm font-medium focus:outline-none',
                selected
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            Reviews
          </Tab>
        </Tab.List>
        <Tab.Panels>
          {/* Overview Panel */}
          <Tab.Panel className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="mt-2 text-gray-600">
                  {provider.description || 'No description provided.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  {provider.phone && (
                    <p className="text-gray-600 flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <a href={`tel:${provider.phone}`} className="hover:text-primary-600">{provider.phone}</a>
                    </p>
                  )}
                  {provider.email && (
                    <p className="text-gray-600 flex items-center">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <a href={`mailto:${provider.email}`} className="hover:text-primary-600">{provider.email}</a>
                    </p>
                  )}
                  {provider.website && (
                    <p className="text-gray-600 flex items-center">
                      <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">{provider.website}</a>
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {provider.business_hours ? (
                    Object.entries(JSON.parse(provider.business_hours)).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium text-gray-500">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Business hours not provided.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Service Area</h3>
                <p className="mt-2 text-gray-600">
                  {provider.service_area || 'Service area not specified.'}
                </p>
              </div>
              
              {provider.insurance_info && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Insurance Information</h3>
                  <p className="mt-2 text-gray-600">
                    {provider.insurance_info}
                  </p>
                </div>
              )}
              
              {provider.license_info && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">License Information</h3>
                  <p className="mt-2 text-gray-600">
                    {provider.license_info}
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
          
          {/* Services Panel */}
          <Tab.Panel className="p-6">
            {services.length > 0 ? (
              <div className="space-y-6">
                {services.map((service) => (
                  <div key={service.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-medium text-gray-900">{service.services?.name}</h3>
                    <p className="mt-2 text-gray-600">
                      {service.services?.description || 'No description provided.'}
                    </p>
                    {service.price_range && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Price Range: {service.price_range}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No services listed</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This provider hasn't listed any services yet.
                </p>
              </div>
            )}
          </Tab.Panel>
          
          {/* Portfolio Panel */}
          <Tab.Panel className="p-6">
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {item.image_url && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      {item.completion_date && (
                        <p className="mt-2 text-xs text-gray-500">
                          Completed: {new Date(item.completion_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This provider hasn't added any portfolio items yet.
                </p>
              </div>
            )}
          </Tab.Panel>
          
          {/* Reviews Panel */}
          <Tab.Panel className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Customer Reviews ({reviews.length})
              </h3>
              <Link
                to={`/dashboard/reviews/new?provider=${provider.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Write a Review
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {review.profiles?.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={review.profiles.avatar_url}
                              alt={`${review.profiles.first_name} ${review.profiles.last_name}`}
                            />
                          ) : (
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {review.profiles ? `${review.profiles.first_name} ${review.profiles.last_name}` : 'Anonymous User'}
                        </p>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating || 0)}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">{review.comment}</p>
                      {review.project_details && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p className="font-medium">Project Details:</p>
                          <p>{review.project_details}</p>
                        </div>
                      )}
                    </div>
                    {review.provider_response && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-900">Response from {provider.business_name}</p>
                        <p className="mt-1 text-sm text-gray-600">{review.provider_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to review this provider.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/dashboard/reviews/new?provider=${provider.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Write a Review
                  </Link>
                </div>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProviderDetail;
