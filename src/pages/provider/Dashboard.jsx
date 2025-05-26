import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import StatCard from '../../components/dashboard/StatCard'

function Dashboard() {
  const { providerProfile } = useAuth()
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingBids: 0,
    upcomingAppointments: 0,
    reviewsCount: 0,
    averageRating: 0
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (providerProfile) {
      fetchDashboardData()
    }
  }, [providerProfile])
  
  const fetchDashboardData = async () => {
    if (!providerProfile) return
    
    try {
      setIsLoading(true)
      
      // Get current date for filtering
      const now = new Date()
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 30)
      
      // Fetch total leads
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
      
      if (projectsError) throw projectsError
      
      // Fetch new leads (last 30 days)
      const { data: newLeadsData, error: newLeadsError } = await supabase
        .from('projects')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
      
      if (newLeadsError) throw newLeadsError
      
      // Fetch active projects
      const { data: activeProjectsData, error: activeProjectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'in_progress')
      
      if (activeProjectsError) throw activeProjectsError
      
      // Fetch bids
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('*')
        .eq('provider_id', providerProfile.id)
      
      if (bidsError) throw bidsError
      
      // Fetch pending bids
      const { data: pendingBidsData, error: pendingBidsError } = await supabase
        .from('bids')
        .select('*')
        .eq('provider_id', providerProfile.id)
        .eq('status', 'pending')
      
      if (pendingBidsError) throw pendingBidsError
      
      // Fetch upcoming appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('provider_id', providerProfile.id)
        .gte('start_time', now.toISOString())
        .order('start_time', { ascending: true })
        .limit(5)
      
      if (appointmentsError) throw appointmentsError
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', providerProfile.id)
      
      if (reviewsError) throw reviewsError
      
      // Fetch recent leads
      const { data: recentLeadsData, error: recentLeadsError } = await supabase
        .from('projects')
        .select('*, services(*)')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentLeadsError) throw recentLeadsError
      
      // Calculate total revenue from accepted bids
      const acceptedBids = bidsData.filter(bid => bid.status === 'accepted')
      const totalRevenue = acceptedBids.reduce((sum, bid) => sum + bid.amount, 0)
      
      // Calculate average rating
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = reviewsData.length > 0 ? totalRating / reviewsData.length : 0
      
      // Set stats
      setStats({
        totalLeads: projectsData.length,
        newLeads: newLeadsData.length,
        activeProjects: activeProjectsData.length,
        totalRevenue,
        pendingBids: pendingBidsData.length,
        upcomingAppointments: appointmentsData.length,
        reviewsCount: reviewsData.length,
        averageRating
      })
      
      // Set recent leads
      setRecentLeads(recentLeadsData)
      
      // Set upcoming appointments
      setUpcomingAppointments(appointmentsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {providerProfile?.business_name || 'Provider'}! Here's an overview of your business.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          linkTo="/leads"
          linkText="View all leads"
        />
        
        <StatCard
          title="New Leads (30 days)"
          value={stats.newLeads}
          icon="M12 4v16m8-8H4"
          color="green"
        />
        
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          color="blue"
        />
        
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="yellow"
        />
        
        <StatCard
          title="Pending Bids"
          value={stats.pendingBids}
          icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
        
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          linkTo="/calendar"
          linkText="View calendar"
          color="purple"
        />
        
        <StatCard
          title="Reviews"
          value={stats.reviewsCount}
          icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          subtext={`${stats.averageRating.toFixed(1)} / 5.0 avg rating`}
          color="orange"
        />
        
        <StatCard
          title="Portfolio Items"
          value="Add Now"
          icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          linkTo="/portfolio"
          linkText="Manage portfolio"
          color="indigo"
        />
      </div>
      
      {/* Recent Leads and Upcoming Appointments */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Leads</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest project opportunities.</p>
            </div>
            <Link
              to="/leads"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View All
            </Link>
          </div>
          
          <div className="border-t border-gray-200">
            {recentLeads.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentLeads.map((lead) => (
                  <li key={lead.id}>
                    <Link to={`/leads/${lead.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">
                              {lead.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {lead.services?.name || 'General'}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {lead.location || 'No location specified'}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>
                              {lead.status === 'open' ? 'Open for bids' : 
                               lead.status === 'in_progress' ? 'In Progress' : 
                               lead.status === 'completed' ? 'Completed' : 
                               lead.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                <p>No recent leads available.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Upcoming Appointments</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your scheduled appointments.</p>
            </div>
            <Link
              to="/calendar"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Calendar
            </Link>
          </div>
          
          <div className="border-t border-gray-200">
            {upcomingAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {appointment.title}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {appointment.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {new Date(appointment.start_time).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>
                            {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(appointment.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      {appointment.customer_name && (
                        <div className="mt-2">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {appointment.customer_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                <p>No upcoming appointments scheduled.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
