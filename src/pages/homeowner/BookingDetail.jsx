import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function BookingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  
  useEffect(() => {
    if (user && id) {
      fetchBookingDetails()
    }
  }, [user, id])
  
  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          properties (name),
          service_providers (
            id,
            business_name,
            logo_url,
            contact_name,
            email,
            phone
          ),
          provider_reviews (
            id,
            rating,
            comment,
            created_at
          )
        `)
        .eq('id', id)
        .eq('homeowner_id', user.id)
        .single()
      
      if (error) throw error
      
      setBooking(data)
      
      // Check if user has already reviewed this booking
      const hasReviewed = data.provider_reviews && data.provider_reviews.length > 0
      
      if (hasReviewed) {
        setReviewData({
          rating: data.provider_reviews[0].rating,
          comment: data.provider_reviews[0].comment
        })
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setError('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      setBooking({ ...booking, status: newStatus })
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Error updating booking status:', error)
      setError('Failed to update booking status')
    }
  }
  
  const handleDeleteBooking = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      navigate('/homeowner/bookings')
    } catch (error) {
      console.error('Error deleting booking:', error)
      setError('Failed to delete booking')
    }
  }
  
  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setReviewData({
      ...reviewData,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    })
  }
  
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    try {
      setSubmittingReview(true)
      
      // Check if review already exists
      const hasReview = booking.provider_reviews && booking.provider_reviews.length > 0
      
      if (hasReview) {
        // Update existing review
        const { error } = await supabase
          .from('provider_reviews')
          .update({
            rating: reviewData.rating,
            comment: reviewData.comment
          })
          .eq('id', booking.provider_reviews[0].id)
        
        if (error) throw error
      } else {
        // Create new review
        const { error } = await supabase
          .from('provider_reviews')
          .insert([
            {
              homeowner_id: user.id,
              provider_id: booking.provider_id,
              booking_id: booking.id,
              rating: reviewData.rating,
              comment: reviewData.comment
            }
          ])
        
        if (error) throw error
      }
      
      // Refresh booking data
      fetchBookingDetails()
      setShowReviewForm(false)
    } catch (error) {
      console.error('Error submitting review:', error)
      setError('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }
  
  const openConfirmModal = (type) => {
    setActionType(type)
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
  
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
  
  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`
  }
  
  const isUpcoming = (booking) => {
    return new Date(booking.start_time) > new Date() && booking.status !== 'cancelled'
  }
  
  const isPast = (booking) => {
    return new Date(booking.start_time) < new Date() || booking.status === 'completed' || booking.status === 'cancelled'
  }
  
  const canReview = (booking) => {
    return booking.status === 'completed' && 
           (!booking.provider_reviews || booking.provider_reviews.length === 0)
  }
  
  const hasReviewed = (booking) => {
    return booking.provider_reviews && booking.provider_reviews.length > 0
  }
  
  // Render star rating input
  const renderStarInput = () => {
    const stars = []
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label key={i} className="star-rating-input">
          <input
            type="radio"
            name="rating"
            value={i}
            checked={reviewData.rating === i}
            onChange={handleReviewChange}
            className="sr-only"
          />
          <svg
            className={`h-8 w-8 cursor-pointer ${
              i <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </label>
      )
    }
    
    return (
      <div className="flex space-x-1">
        {stars}
      </div>
    )
  }
  
  // Render star rating display
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
  
  if (!booking) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Booking not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The booking you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <div className="mt-6">
            <Link
              to="/homeowner/bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Bookings
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
          to="/homeowner/bookings"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <svg className="mr-1 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Bookings
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
      
      {/* Booking Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{booking.title}</h1>
            <div className="mt-1 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                booking.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {isUpcoming(booking) && (
              <button
                onClick={() => openConfirmModal('cancel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'scheduled' && isPast(booking) && (
              <button
                onClick={() => openConfirmModal('complete')}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Mark as Completed
              </button>
            )}
            {(booking.status === 'cancelled' || booking.status === 'completed') && (
              <button
                onClick={() => openConfirmModal('delete')}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link to={`/homeowner/providers/${booking.service_providers?.id}`} className="text-primary-600 hover:text-primary-500">
                  {booking.service_providers?.business_name || 'Unknown Provider'}
                </Link>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.services?.name || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Property</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.properties?.name || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDateTime(booking.start_time)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.duration ? `${booking.duration} minutes` : 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Price</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.price ? `$${booking.price.toFixed(2)}` : 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.notes || 'No notes provided.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Provider Contact Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Provider Contact Information</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Contact details for the service provider.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.service_providers?.contact_name || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.service_providers?.email ? (
                  <a href={`mailto:${booking.service_providers.email}`} className="text-primary-600 hover:text-primary-500">
                    {booking.service_providers.email}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {booking.service_providers?.phone ? (
                  <a href={`tel:${booking.service_providers.phone}`} className="text-primary-600 hover:text-primary-500">
                    {booking.service_providers.phone}
                  </a>
                ) : (
                  'Not specified'
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Actions</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link
                  to={`/homeowner/messages?provider=${booking.provider_id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Message Provider
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Review Section */}
      {(booking.status === 'completed') && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Service Review</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {hasReviewed(booking)
                  ? 'Your review of this service.'
                  : 'Share your experience with this service provider.'}
              </p>
            </div>
            {hasReviewed(booking) && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Edit Review
              </button>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {hasReviewed(booking) && !showReviewForm ? (
              <div>
                <div className="flex items-center">
                  <div className="flex">
                    {renderStars(booking.provider_reviews[0].rating)}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    Reviewed on {formatDate(booking.provider_reviews[0].created_at)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-900">
                  {booking.provider_reviews[0].comment || 'No comment provided.'}
                </p>
              </div>
            ) : canReview(booking) || showReviewForm ? (
              <form onSubmit={handleSubmitReview}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="mt-1">
                      {renderStarInput()}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={reviewData.comment}
                      onChange={handleReviewChange}
                      placeholder="Share your experience with this service provider..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    {showReviewForm && (
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : hasReviewed(booking) ? 'Update Review' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  You can leave a review once the service is completed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
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
                    actionType === 'delete' || actionType === 'cancel'
                      ? 'bg-red-100'
                      : 'bg-primary-100'
                  }`}>
                    {actionType === 'delete' || actionType === 'cancel' ? (
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
                      {actionType === 'delete' && 'Delete Booking'}
                      {actionType === 'cancel' && 'Cancel Booking'}
                      {actionType === 'complete' && 'Mark as Completed'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {actionType === 'delete' && 'Are you sure you want to delete this booking? This action cannot be undone.'}
                        {actionType === 'cancel' && 'Are you sure you want to cancel this booking? The service provider will be notified.'}
                        {actionType === 'complete' && 'Are you sure you want to mark this booking as completed?'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    actionType === 'delete' || actionType === 'cancel'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                  }`}
                  onClick={() => {
                    if (actionType === 'delete') handleDeleteBooking()
                    else if (actionType === 'cancel') handleStatusChange('cancelled')
                    else if (actionType === 'complete') handleStatusChange('completed')
                  }}
                >
                  {actionType === 'delete' && 'Delete'}
                  {actionType === 'cancel' && 'Cancel'}
                  {actionType === 'complete' && 'Complete'}
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

export default BookingDetail
