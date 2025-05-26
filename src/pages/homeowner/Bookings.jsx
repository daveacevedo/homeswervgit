import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])
  
  const fetchBookings = async () => {
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
            logo_url
          )
        `)
        .eq('homeowner_id', user.id)
        .order('start_time', { ascending: true })
      
      if (error) throw error
      
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
    } catch (error) {
      console.error('Error updating booking status:', error)
      setError('Failed to update booking status')
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
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return isUpcoming(booking)
    if (activeTab === 'past') return isPast(booking)
    return true
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
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your scheduled service appointments.
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
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'upcoming'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'past'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
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
          </nav>
        </div>
        
        <Link
          to="/homeowner/bookings/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Booking
        </Link>
      </div>
      
      {filteredBookings.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <li key={booking.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary-600">
                        <Link to={`/homeowner/bookings/${booking.id}`} className="hover:underline">
                          {booking.title}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDateTime(booking.start_time)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isUpcoming(booking) && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                      )}
                      <Link
                        to={`/homeowner/bookings/${booking.id}`}
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
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        {booking.service_providers?.business_name || 'Unknown Provider'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {booking.services?.name || 'General Service'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {booking.properties?.name || 'No property specified'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {booking.duration ? `${booking.duration} minutes` : 'Duration not specified'}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming bookings."
                : activeTab === 'past'
                ? "You don't have any past bookings."
                : "You haven't scheduled any service appointments yet."}
            </p>
            <div className="mt-6">
              <Link
                to="/homeowner/bookings/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Schedule a Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
