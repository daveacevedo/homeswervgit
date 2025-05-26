import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function LeadsList() {
  const { providerProfile } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  
  useEffect(() => {
    if (providerProfile) {
      fetchLeads()
    }
  }, [providerProfile, filter, sortBy, sortDirection])
  
  const fetchLeads = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          services (
            id,
            name
          ),
          bids (
            id,
            provider_id,
            amount,
            status,
            created_at
          )
        `)
      
      // Apply filters
      if (filter === 'open') {
        query = query.eq('status', 'open')
      } else if (filter === 'in_progress') {
        query = query.eq('status', 'in_progress')
      } else if (filter === 'completed') {
        query = query.eq('status', 'completed')
      } else if (filter === 'my_bids') {
        // This will be filtered client-side after fetching
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' })
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Filter for "my_bids" option
      let filteredData = data
      if (filter === 'my_bids' && providerProfile) {
        filteredData = data.filter(lead => 
          lead.bids && lead.bids.some(bid => bid.provider_id === providerProfile.id)
        )
      }
      
      setLeads(filteredData)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }
  
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to descending for new sort field
      setSortBy(field)
      setSortDirection('desc')
    }
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Filter leads based on search query
    // This is a client-side search for simplicity
  }
  
  const filteredLeads = searchQuery
    ? leads.filter(lead => 
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leads
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  const hasBidOnLead = (lead) => {
    if (!providerProfile || !lead.bids) return false
    return lead.bids.some(bid => bid.provider_id === providerProfile.id)
  }
  
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
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse and manage project opportunities.
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === 'all'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Leads
                </button>
                <button
                  onClick={() => handleFilterChange('open')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === 'open'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => handleFilterChange('in_progress')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === 'in_progress'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === 'completed'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => handleFilterChange('my_bids')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === 'my_bids'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Bids
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="flex rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md sm:text-sm border-gray-300"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Leads Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('title')}
                    >
                      <div className="flex items-center">
                        <span>Project</span>
                        {sortBy === 'title' && (
                          <svg
                            className={`ml-1 w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('services.name')}
                    >
                      <div className="flex items-center">
                        <span>Service</span>
                        {sortBy === 'services.name' && (
                          <svg
                            className={`ml-1 w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('location')}
                    >
                      <div className="flex items-center">
                        <span>Location</span>
                        {sortBy === 'location' && (
                          <svg
                            className={`ml-1 w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('created_at')}
                    >
                      <div className="flex items-center">
                        <span>Date</span>
                        {sortBy === 'created_at' && (
                          <svg
                            className={`ml-1 w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('status')}
                    >
                      <div className="flex items-center">
                        <span>Status</span>
                        {sortBy === 'status' && (
                          <svg
                            className={`ml-1 w-4 h-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Bid Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {lead.description.substring(0, 60)}
                                {lead.description.length > 60 ? '...' : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.services?.name || 'General'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.location || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.status)}`}>
                            {lead.status === 'open' ? 'Open' : 
                             lead.status === 'in_progress' ? 'In Progress' : 
                             lead.status === 'completed' ? 'Completed' : 
                             lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hasBidOnLead(lead) ? (
                            <span className="text-primary-600 font-medium">Bid Submitted</span>
                          ) : (
                            <span>No Bid</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/leads/${lead.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadsList
