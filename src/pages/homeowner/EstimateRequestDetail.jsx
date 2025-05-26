import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function EstimateRequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [estimateRequest, setEstimateRequest] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState(null)
  const [selectedResponseId, setSelectedResponseId] = useState(null)
  
  useEffect(() => {
    if (user && id) {
      fetchEstimateRequestDetails()
    }
  }, [user, id])
  
  const fetchEstimateRequestDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch estimate request
      const { data: requestData, error: requestError } = await supabase
        .from('estimate_requests')
        .select(`
          *,
          services (name),
          properties (name)
        `)
        .eq('id', id)
        .eq('homeowner_id', user.id)
        .single()
      
      if (requestError) throw requestError
      
      setEstimateRequest(requestData)
      
      // Fetch estimate responses
      const { data: responseData, error: responseError } = await supabase
        .from('estimate_responses')
        .select(`
          *,
          service_providers (
            id,
            business_name,
            logo_url,
            contact_name,
            email,
            phone,
            provider_reviews (
              id,
              rating
            )
          )
        `)
        .eq('estimate_request_id', id)
        .order('created_at', { ascending: false })
      
      if (responseError) throw responseError
      
      // Calculate average rating for each provider
      const responsesWithRating = responseData.map(response => {
        const reviews = response.service_providers?.provider_reviews || []
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0
        
        return {
          ...response,
          averageRating,
          reviewCount: reviews.length
        }
      })
      
      setResponses(responsesWithRating || [])
    } catch (error) {
      console.error('Error fetching estimate request details:', error)
      setError('Failed to load estimate request details')
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('estimate_requests')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      setEstimateRequest({ ...estimateRequest, status: newStatus })
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Error updating estimate request status:', error)
      setError('Failed to update request status')
    }
  }
  
  const handleAcceptResponse = async (responseId) => {
    try {
      // Update the response status to accepted
      const { error: responseError } = await supabase
        .from('estimate_responses')
        .update({ status: 'accepted' })
        .eq('id', responseId)
      
      if (responseError) throw responseError
      
      // Update other responses to declined
      const { error: otherResponsesError } = await supabase
        .from('estimate_responses')
        .update({ status: 'declined' })
        .eq('estimate_request_id', id)
        .neq('id', responseId)
      
      if (otherResponsesError) throw otherResponsesError
      
      // Update the estimate request status to in_progress
      const { error: requestError } = await supabase
        .from('estimate_requests')
        .update({ status: 'in_progress' })
        .eq('id', id)
      
      if (requestError) throw requestError
      
      // Refresh data
      fetchEstimateRequestDetails()
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Error accepting estimate response:', error)
      setError('Failed to accept estimate')
    }
  }
  
  const handleDeclineResponse = async (responseId) => {
    try {
      const { error } = await supabase
        .from('estimate_responses')
        .update({ status: 'declined' })
        .eq('id', responseId)
      
      if (error) throw error
      
      // Update local state
      setResponses(responses.map(response => 
        response.id === responseId ? { ...response, status: 'declined' } : response
      ))
      
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Error declining estimate response:', error)
      setError('Failed to decline estimate')
    }
  }
  
  const handleDeleteRequest = async () => {
    try {
      const { error } = await supabase
        .from('estimate_requests')
        .delete()
        .eq('id', id)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      navigate('/homeowner/estimate-requests')
    } catch (error) {
      console.error('Error deleting estimate request:', error)
      setError('Failed to delete estimate request')
    }
  }
  
  const openConfirmModal = (type, responseId = null) => {
    setActionType(type)
    setSelectedResponseId(responseId)
    setShowConfirmModal(true)
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
  
  // Render star rating
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
  
  if (!estimateRequest) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Estimate request not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The estimate request you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="mt-6">
            <Link
              to="/homeowner/estimate-requests"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Estimate Requests
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link
          to="/homeowner/estimate-requests"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <svg className="mr-1 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Estimate Requests
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
      
      {/* Estimate Request Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{estimateRequest.title}</h1>
            <div className="mt-1 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                estimateRequest.status === 'open' ? 'bg-green-100 text-green-800' :
                estimateRequest.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                estimateRequest.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                estimateRequest.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {estimateRequest.status.replace('_', ' ').charAt(0).toUpperCase() + estimateRequest.status.replace('_', ' ').slice(1)}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                Created on {formatDate(estimateRequest.created_at)}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {estimateRequest.status === 'open' && (
              <button
                onClick={() => openConfirmModal('cancel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel Request
              </button>
            )}
            {(estimateRequest.status === 'open' || estimateRequest.status === 'cancelled') && (
              <button
                onClick={() => openConfirmModal('delete')}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}
            {estimateRequest.status === 'in_progress' && (
              <button
                onClick={() => openConfirmModal('complete')}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service</dt>
              <dd className="mt-1 text-sm text-gray-900">{estimateRequest.services?.name || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Property</dt>
              <dd className="mt-1 text-sm text-gray-900">{estimateRequest.properties?.name || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {estimateRequest.budget_min && estimateRequest.budget_max ? (
                  <span>{formatCurrency(estimateRequest.budget_min)} - {formatCurrency(estimateRequest.budget_max)}</span>
                ) : estimateRequest.budget_min ? (
                  <span>Min: {formatCurrency(estimateRequest.budget_min)}</span>
                ) : estimateRequest.budget_max ? (
                  <span>Max: {formatCurrency(estimateRequest.budget_max)}</span>
                ) : (
                  <span>Not specified</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Timeline</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {estimateRequest.timeline_start && estimateRequest.timeline_end ? (
                  <span>{formatDate(estimateRequest.timeline_start)} - {formatDate(estimateRequest.timeline_end)}</span>
                ) : estimateRequest.timeline_start ? (
                  <span>Start: {formatDate(estimateRequest.timeline_start)}</span>
                ) : estimateRequest.timeline_end ? (
                  <span>End: {formatDate(estimateRequest.timeline_end)}</span>
                ) : (
                  <span>Not specified</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {estimateRequest.description || 'No description provided.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Estimate Responses */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Estimate Responses</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Responses from service providers for your estimate request.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {responses.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {responses.map((response) => (
                <li key={response.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {response.service_providers?.logo_url ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={response.service_providers.logo_url}
                            alt={response.service_providers.business_name}
                          />
                        ) : (
                          <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/homeowner/providers/${response.service_providers?.id}`} className="hover:underline">
                            {response.service_providers?.business_name}
                          </Link>
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {renderStars(response.averageRating || 0)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            ({response.reviewCount || 0} {response.reviewCount === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(response.price)}</p>
                      <p className="text-sm text-gray-500">Responded on {formatDate(response.created_at)}</p>
                      {response.status && (
                        <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          response.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          response.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Estimate Details</h4>
                    <p className="mt-1 text-sm text-gray-900">{response.description || 'No additional details provided.'}</p>
                  </div>
                  
                  {response.timeline && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Timeline</h4>
                      <p className="mt-1 text-sm text-gray-900">{response.timeline}</p>
                    </div>
                  )}
                  
                  {estimateRequest.status === 'open' && response.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => openConfirmModal('accept', response.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Accept Estimate
                      </button>
                      <button
                        onClick={() => openConfirmModal('decline', response.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Decline
                      </button>
                      <Link
                        to={`/homeowner/messages?provider=${response.provider_id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Message Provider
                      </Link>
                    </div>
                  )}
                  
                  {(response.status === 'accepted' || estimateRequest.status === 'in_progress' || estimateRequest.status === 'completed') && (
                    <div className="mt-4 flex space-x-3">
                      <Link
                        to={`/homeowner/messages?provider=${response.provider_id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Message Provider
                      </Link>
                      {response.status === 'accepted' && estimateRequest.status === 'in_progress' && (
                        <Link
                          to={`/homeowner/bookings/new?provider=${response.provider_id}&service=${estimateRequest.service_id}&property=${estimateRequest.property_id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Schedule Service
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                {estimateRequest.status === 'open'
                  ? "You haven't received any responses to this estimate request yet."
                  : "This estimate request didn't receive any responses."}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                    actionType === 'delete' || actionType === 'cancel' || actionType === 'decline'
                      ? 'bg-red-100'
                      : 'bg-primary-100'
                  }`}>
                    {actionType === 'delete' || actionType === 'cancel' || actionType === 'decline' ? (
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {actionType === 'delete' && 'Delete Estimate Request'}
                      {actionType === 'cancel' && 'Cancel Estimate Request'}
                      {actionType === 'complete' && 'Mark as Completed'}
                      {actionType === 'accept' && 'Accept Estimate'}
                      {actionType === 'decline' && 'Decline Estimate'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {actionType === 'delete' && 'Are you sure you want to delete this estimate request? This action cannot be undone.'}
                        {actionType === 'cancel' && 'Are you sure you want to cancel this estimate request? Providers will no longer be able to respond.'}
                        {actionType === 'complete' && 'Are you sure you want to mark this request as completed?'}
                        {actionType === 'accept' && 'Are you sure you want to accept this estimate? This will decline all other estimates.'}
                        {actionType === 'decline' && 'Are you sure you want to decline this estimate?'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    actionType === 'delete' || actionType === 'cancel' || actionType === 'decline'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                  }`}
                  onClick={() => {
                    if (actionType === 'delete') handleDeleteRequest()
                    else if (actionType === 'cancel') handleStatusChange('cancelled')
                    else if (actionType === 'complete') handleStatusChange('completed')
                    else if (actionType === 'accept') handleAcceptResponse(selectedResponseId)
                    else if (actionType === 'decline') handleDeclineResponse(selectedResponseId)
                  }}
                >
                  {actionType === 'delete' && 'Delete'}
                  {actionType === 'cancel' && 'Cancel'}
                  {actionType === 'complete' && 'Complete'}
                  {actionType === 'accept' && 'Accept'}
                  {actionType === 'decline' && 'Decline'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstimateRequestDetail
