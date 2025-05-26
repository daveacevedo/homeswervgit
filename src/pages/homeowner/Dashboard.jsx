import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useHomeowner } from '../../contexts/HomeownerContext'

function HomeownerDashboard() {
  const { user } = useAuth()
  const { homeownerProfile, properties, visionBoards, projectPlans, loading } = useHomeowner()
  const [estimateRequests, setEstimateRequests] = useState([])
  const [bookings, setBookings] = useState([])
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  
  useEffect(() => {
    if (user && homeownerProfile) {
      fetchDashboardData()
    }
  }, [user, homeownerProfile])
  
  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      
      // Fetch estimate requests
      const { data: estimateData, error: estimateError } = await supabase
        .from('estimate_requests')
        .select(`
          *,
          services (name),
          properties (name)
        `)
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (estimateError) throw estimateError
      
      setEstimateRequests(estimateData || [])
      
      // Fetch bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          service_providers (business_name),
          services (name),
          properties (name)
        `)
        .eq('homeowner_id', user.id)
        .order('start_time', { ascending: true })
        .limit(5)
      
      if (bookingError) throw bookingError
      
      setBookings(bookingData || [])
      
      // Fetch unread messages count
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('receiver_id', user.id)
        .eq('read', false)
      
      if (messageError) throw messageError
      
      setUnreadMessages(messageData?.length || 0)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setDashboardLoading(false)
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
  
  if (loading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Homeowner Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {homeownerProfile?.first_name}! Here's an overview of your home projects and services.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Properties</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{properties.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/homeowner/properties" className="font-medium text-primary-600 hover:text-primary-500">
                View all properties
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Vision Boards</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{visionBoards.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/homeowner/vision-boards" className="font-medium text-primary-600 hover:text-primary-500">
                View all vision boards
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Project Plans</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{projectPlans.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/homeowner/project-plans" className="font-medium text-primary-600 hover:text-primary-500">
                View all project plans
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{unreadMessages}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/homeowner/messages" className="font-medium text-primary-600 hover:text-primary-500">
                View all messages
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/homeowner/properties/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Property
            </Link>
            <Link
              to="/homeowner/vision-boards/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Vision Board
            </Link>
            <Link
              to="/homeowner/project-plans/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Plan a Project
            </Link>
            <Link
              to="/homeowner/find-providers"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Find Service Providers
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Upcoming Bookings</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your scheduled service appointments.</p>
            </div>
            <Link
              to="/homeowner/bookings"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {bookings.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    <Link to={`/homeowner/bookings/${booking.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{booking.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">{formatDate(booking.start_time)}</p>
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
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-sm text-gray-500">
                <p>You don't have any upcoming bookings.</p>
                <Link
                  to="/homeowner/find-providers"
                  className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                >
                  Find service providers
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Estimate Requests */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Estimate Requests</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your requests for service estimates.</p>
            </div>
            <Link
              to="/homeowner/estimate-requests"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {estimateRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {estimateRequests.map((request) => (
                  <li key={request.id}>
                    <Link to={`/homeowner/estimate-requests/${request.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{request.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'open' ? 'bg-green-100 text-green-800' :
                                request.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">{formatDate(request.created_at)}</p>
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
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-sm text-gray-500">
                <p>You haven't requested any estimates yet.</p>
                <Link
                  to="/homeowner/estimate-requests/new"
                  className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-500"
                >
                  Request an estimate
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeownerDashboard
