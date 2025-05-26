import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, providerProfile } = useAuth()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [bidTimeframe, setBidTimeframe] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [existingBid, setExistingBid] = useState(null)
  
  useEffect(() => {
    if (id) {
      fetchLeadDetails()
    }
  }, [id])
  
  const fetchLeadDetails = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          services (
            id,
            name,
            description
          ),
          bids (
            id,
            provider_id,
            amount,
            message,
            timeframe,
            status,
            created_at
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      setLead(data)
      
      // Check if provider has already bid on this lead
      if (data.bids && providerProfile) {
        const providerBid = data.bids.find(bid => bid.provider_id === providerProfile.id)
        if (providerBid) {
          setExistingBid(providerBid)
          setBidAmount(providerBid.amount)
          setBidMessage(providerBid.message)
          setBidTimeframe(providerBid.timeframe)
        }
      }
    } catch (error) {
      console.error('Error fetching lead details:', error)
      setError('Failed to load lead details. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmitBid = async (e) => {
    e.preventDefault()
    
    if (!providerProfile) {
      setError('You must complete your provider profile before submitting bids.')
      return
    }
    
    try {
      setSubmittingBid(true)
      setError(null)
      
      const bidData = {
        project_id: id,
        provider_id: providerProfile.id,
        amount: parseFloat(bidAmount),
        message: bidMessage,
        timeframe: bidTimeframe,
        status: 'pending'
      }
      
      let result
      
      if (existingBid) {
        // Update existing bid
        const { data, error } = await supabase
          .from('bids')
          .update(bidData)
          .eq('id', existingBid.id)
          .select()
        
        if (error) throw error
        result = data
        setSuccess('Your bid has been updated successfully!')
      } else {
        // Create new bid
        const { data, error } = await supabase
          .from('bids')
          .insert([bidData])
          .select()
        
        if (error) throw error
        result = data
        setSuccess('Your bid has been submitted successfully!')
      }
      
      // Update the existing bid in state
      if (result && result[0]) {
        setExistingBid(result[0])
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error submitting bid:', error)
      setError('Failed to submit bid. Please try again.')
    } finally {
      setSubmittingBid(false)
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
        <p className="mt-2 text-gray-500">The lead you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/leads')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Leads
        </button>
      </div>
    )
  }
  
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
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posted on {formatDate(lead.created_at)}
            </p>
          </div>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.status)}`}>
            {lead.status === 'open' ? 'Open' : 
             lead.status === 'in_progress' ? 'In Progress' : 
             lead.status === 'completed' ? 'Completed' : 
             lead.status}
          </span>
        </div>
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
      
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lead Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Project Details</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Information about the project requirements and specifications.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Service Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.services?.name || 'General'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.location || 'Not specified'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Budget</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.budget ? `$${lead.budget.toLocaleString()}` : 'Not specified'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {lead.timeline || 'Flexible'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                    {lead.description}
                  </dd>
                </div>
                {lead.attachments && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {lead.attachments.map((attachment, index) => (
                          <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-500">
                                Download
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        
        {/* Bid Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {existingBid ? 'Your Bid' : 'Submit a Bid'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {existingBid 
                  ? `Bid Status: ${existingBid.status.charAt(0).toUpperCase() + existingBid.status.slice(1)}`
                  : 'Provide your proposal for this project.'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              {lead.status === 'open' ? (
                <form onSubmit={handleSubmitBid} className="space-y-6 sm:px-6 sm:py-5">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                      Bid Amount ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="bidAmount"
                        id="bidAmount"
                        min="0"
                        step="0.01"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bidTimeframe" className="block text-sm font-medium text-gray-700">
                      Estimated Timeframe
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="bidTimeframe"
                        id="bidTimeframe"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., 2 weeks, 3-4 days"
                        value={bidTimeframe}
                        onChange={(e) => setBidTimeframe(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700">
                      Proposal Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bidMessage"
                        name="bidMessage"
                        rows="4"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your approach, qualifications, and any questions you have."
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      disabled={submittingBid}
                    >
                      {submittingBid ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {existingBid ? 'Update Bid' : 'Submit Bid'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="px-6 py-5 text-center">
                  <p className="text-sm text-gray-500">
                    This project is no longer accepting bids.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          {lead.contact_info && (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Project contact details.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {lead.contact_info.name && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {lead.contact_info.name}
                      </dd>
                    </div>
                  )}
                  {lead.contact_info.email && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`mailto:${lead.contact_info.email}`} className="text-primary-600 hover:text-primary-500">
                          {lead.contact_info.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {lead.contact_info.phone && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`tel:${lead.contact_info.phone}`} className="text-primary-600 hover:text-primary-500">
                          {lead.contact_info.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadDetail
