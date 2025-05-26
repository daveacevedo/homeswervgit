import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function FindProviders() {
  const navigate = useNavigate()
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useState({
    query: '',
    service_id: '',
    location: '',
    sort_by: 'rating'
  })
  
  useEffect(() => {
    fetchServices()
    fetchProviders()
  }, [])
  
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to load services')
    }
  }
  
  const fetchProviders = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('service_providers')
        .select(`
          *,
          provider_services (
            service_id,
            services (name)
          ),
          provider_reviews (
            id,
            rating
          )
        `)
        .eq('is_active', true)
      
      // Apply filters
      if (searchParams.service_id) {
        query = query.contains('provider_services', [{ service_id: searchParams.service_id }])
      }
      
      if (searchParams.location) {
        query = query.ilike('service_area', `%${searchParams.location}%`)
      }
      
      if (searchParams.query) {
        query = query.or(`business_name.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%`)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Calculate average rating for each provider
      const providersWithRating = data.map(provider => {
        const reviews = provider.provider_reviews || []
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
        
        return {
          ...provider,
          averageRating,
          reviewCount: reviews.length
        }
      })
      
      // Sort providers
      let sortedProviders = [...providersWithRating]
      
      if (searchParams.sort_by === 'rating') {
        sortedProviders.sort((a, b) => b.averageRating - a.averageRating)
      } else if (searchParams.sort_by === 'name') {
        sortedProviders.sort((a, b) => a.business_name.localeCompare(b.business_name))
      }
      
      setProviders(sortedProviders)
    } catch (error) {
      console.error('Error fetching providers:', error)
      setError('Failed to load service providers')
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams({
      ...searchParams,
      [name]: value
    })
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    fetchProviders()
  }
  
  const handleRequestEstimate = (providerId) => {
    navigate(`/homeowner/estimate-requests/new?provider=${providerId}`)
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
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Service Providers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search for qualified professionals for your home service needs.
        </p>
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
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-6 sm:gap-x-4">
            <div className="sm:col-span-6">
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="query"
                  id="query"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by business name or description"
                  value={searchParams.query}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <div className="mt-1">
                <select
                  id="service_id"
                  name="service_id"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchParams.service_id}
                  onChange={handleInputChange}
                >
                  <option value="">All Services</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="City, state, or zip code"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="sort_by" className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="mt-1">
                <select
                  id="sort_by"
                  name="sort_by"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchParams.sort_by}
                  onChange={handleInputChange}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Results Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {loading ? 'Searching...' : `${providers.length} providers found`}
        </h2>
        <Link
          to="/homeowner/estimate-requests/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Estimate Request
        </Link>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {provider.logo_url ? (
                      <img
                        className="h-16 w-16 rounded-full"
                        src={provider.logo_url}
                        alt={provider.business_name}
                      />
                    ) : (
                      <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link to={`/homeowner/providers/${provider.id}`} className="hover:underline">
                        {provider.business_name}
                      </Link>
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {renderStars(provider.averageRating || 0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({provider.reviewCount || 0} {provider.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {provider.description || 'No description available.'}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Services</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {provider.provider_services && provider.provider_services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {service.services?.name || 'Unknown Service'}
                      </span>
                    ))}
                    {provider.provider_services && provider.provider_services.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{provider.provider_services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-5 flex space-x-3">
                  <Link
                    to={`/homeowner/providers/${provider.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleRequestEstimate(provider.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Request Estimate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters or try a different search term.
            </p>
            <div className="mt-6">
              <Link
                to="/homeowner/estimate-requests/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Estimate Request Anyway
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindProviders
