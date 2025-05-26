import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function ProviderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (id) {
      fetchProviderDetails()
    }
  }, [id])
  
  const fetchProviderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch provider details
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select(`
          *,
          provider_services (
            service_id,
            services (name)
          )
        `)
        .eq('id', id)
        .single()
      
      if (providerError) throw providerError
      
      setProvider(providerData)
      
      // Fetch provider reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('provider_reviews')
        .select(`
          *,
          homeowners (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('provider_id', id)
        .order('created_at', { ascending: false })
      
      if (reviewsError) throw reviewsError
      
      setReviews(reviewsData || [])
      
      // Fetch provider portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('provider_id', id)
        .order('created_at', { ascending: false })
      
      if (portfolioError) throw portfolioError
      
      setPortfolio(portfolioData || [])
    } catch (error) {
      console.error('Error fetching provider details:', error)
      setError('Failed to load provider details')
    } finally {
      setLoading(false)
    }
  }
  
  const handleRequestEstimate = () => {
    navigate(`/homeowner/estimate-requests/new?provider=${id}`)
  }
  
  const handleContactProvider = () => {
    navigate(`/homeowner/messages?provider=${id}`)
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0
    
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return totalRating / reviews.length
  }
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }
    
    return stars
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!provider) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Provider not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The service provider you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/homeowner/find-providers"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Providers
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  const averageRating = calculateAverageRating()
  
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/homeowner/find-providers"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <svg className="mr-1 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Providers
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
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
            </div>
          </div>
        </div>
      )}
      
      {/* Provider Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              {provider.logo_url ? (
                <img
                  className="h-20 w-20 rounded-full"
                  src={provider.logo_url}
                  alt={provider.business_name}
                />
              ) : (
                <svg className="h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{provider.business_name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {renderStars(averageRating)}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {provider.provider_services && provider.provider_services.map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {service.services?.name || 'Unknown Service'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
            <button
              onClick={handleRequestEstimate}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Request Estimate
            </button>
            <button
              onClick={handleContactProvider}
              className="mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Message Provider
            </button>
          </div>
        </div>
      </div>
      
      {/* Provider Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Provider Information</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details about the service provider.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {provider.description || 'No description provided.'}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
              <dd className="mt-1 text-sm text-gray-900">{provider.contact_name || 'Not specified'}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Business Hours</dt>
              <dd className="mt-1 text-sm text-gray-900">{provider.business_hours || 'Not specified'}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {provider.phone ? (
                  <a href={`tel:${provider.phone}`} className="text-primary-600 hover:text-primary-500">
                    {provider.phone}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {provider.email ? (
                  <a href={`mailto:${provider.email}`} className="text-primary-600 hover:text-primary-500">
                    {provider.email}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {provider.website ? (
                  <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500">
                    {provider.website}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service Area</dt>
              <dd className="mt-1 text-sm text-gray-900">{provider.service_area || 'Not specified'}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Portfolio Section */}
      {portfolio.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Portfolio</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Previous work examples from this provider.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden group">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-white text-sm opacity-80">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Reviews Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Reviews</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            What customers are saying about this provider.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {reviews.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <li key={review.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {review.homeowners?.avatar_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={review.homeowners.avatar_url}
                            alt={`${review.homeowners.first_name} ${review.homeowners.last_name}`}
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
                        {review.homeowners ? `${review.homeowners.first_name} ${review.homeowners.last_name}` : 'Anonymous User'}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {renderStars(review.rating || 0)}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{review.comment || 'No comment provided.'}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                This provider hasn't received any reviews yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProviderDetail
