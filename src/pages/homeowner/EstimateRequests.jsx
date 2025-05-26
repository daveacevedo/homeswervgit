import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function EstimateRequests() {
  const { user } = useAuth()
  const [estimateRequests, setEstimateRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  
  useEffect(() => {
    if (user) {
      fetchEstimateRequests()
    }
  }, [user])
  
  const fetchEstimateRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('estimate_requests')
        .select(`
          *,
          services (name),
          properties (name),
          estimate_responses (
            id,
            provider_id,
            price,
            status,
            created_at,
            service_providers (
              business_name,
              logo_url
            )
          )
        `)
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setEstimateRequests(data || [])
    } catch (error) {
      console.error('Error fetching estimate requests:', error)
      setError('Failed to load estimate requests')
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const { error } = await supabase
        .from('estimate_requests')
        .update({ status: newStatus })
        .eq('id', requestId)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      // Update local state
      setEstimateRequests(estimateRequests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      ))
    } catch (error) {
      console.error('Error updating estimate request status:', error)
      setError('Failed to update request status')
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  const filteredRequests = estimateRequests.filter(request => {
    if (activeTab === 'all') return true
    return request.status === activeTab
  })
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estimate Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your service estimate requests and responses.
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
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'open'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'in_progress'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'completed'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'cancelled'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cancelled
            </button>
          </nav>
        </div>
        
        <Link
          to="/homeowner/find-providers"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Estimate Request
        </Link>
      </div>
      
      {filteredRequests.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary-600">
                        <Link to={`/homeowner/estimate-requests/${request.id}`} className="hover:underline">
                          {request.title}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'open' ? 'bg-green-100 text-green-800' :
                          request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          Created on {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'cancelled')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                      )}
                      <Link
                        to={`/homeowner/estimate-requests/${request.id}`}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {request.services?.name || 'General Service'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {request.properties?.name || 'No property specified'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      {request.budget_min && request.budget_max ? (
                        <span>{formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}</span>
                      ) : request.budget_min ? (
                        <span>Min: {formatCurrency(request.budget_min)}</span>
                      ) : request.budget_max ? (
                        <span>Max: {formatCurrency(request.budget_max)}</span>
                      ) : (
                        <span>No budget specified</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Responses summary */}
                  {request.estimate_responses && request.estimate_responses.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">Responses ({request.estimate_responses.length})</h4>
                      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {request.estimate_responses.slice(0, 3).map((response) => (
                          <div key={response.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {response.service_providers?.logo_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={response.service_providers.logo_url}
                                    alt={response.service_providers.business_name}
                                  />
                                ) : (
                                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {response.service_providers?.business_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatCurrency(response.price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {request.estimate_responses.length > 3 && (
                          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
                            <Link
                              to={`/homeowner/estimate-requests/${request.id}`}
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              View all {request.estimate_responses.length} responses
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No estimate requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all'
                ? "You haven't created any estimate requests yet."
                : `You don't have any ${activeTab.replace('_', ' ')} estimate requests.`}
            </p>
            <div className="mt-6">
              <Link
                to="/homeowner/find-providers"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Estimate Request
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstimateRequests
