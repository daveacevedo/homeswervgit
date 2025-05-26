import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useHomeowner } from '../../contexts/HomeownerContext'

function NewEstimateRequest() {
  const { user } = useAuth()
  const { properties } = useHomeowner()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    service_id: queryParams.get('service') || '',
    property_id: queryParams.get('property') || '',
    description: '',
    budget_min: '',
    budget_max: '',
    timeline_start: '',
    timeline_end: '',
    is_urgent: false,
    preferred_contact_method: 'email'
  })
  
  useEffect(() => {
    fetchServices()
    setLoading(false)
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
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      // Validate form
      if (!formData.title || !formData.service_id || !formData.property_id || !formData.description) {
        throw new Error('Please fill in all required fields')
      }
      
      // Create estimate request
      const { data, error } = await supabase
        .from('estimate_requests')
        .insert([
          {
            homeowner_id: user.id,
            service_id: formData.service_id,
            property_id: formData.property_id,
            title: formData.title,
            description: formData.description,
            budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
            budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
            timeline_start: formData.timeline_start || null,
            timeline_end: formData.timeline_end || null,
            is_urgent: formData.is_urgent,
            preferred_contact_method: formData.preferred_contact_method,
            status: 'open'
          }
        ])
        .select()
      
      if (error) throw error
      
      // Navigate to estimate request detail page
      navigate(`/homeowner/estimate-requests/${data[0].id}`)
    } catch (error) {
      console.error('Error creating estimate request:', error)
      setError(error.message || 'Failed to create estimate request')
    } finally {
      setSubmitting(false)
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Request an Estimate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get quotes from service providers for your project.
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
      
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Request Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Kitchen Renovation Estimate"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                Service Type *
              </label>
              <select
                id="service_id"
                name="service_id"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.service_id}
                onChange={handleInputChange}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
                Property *
              </label>
              <select
                id="property_id"
                name="property_id"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.property_id}
                onChange={handleInputChange}
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                <Link to="/homeowner/properties/new" className="text-primary-600 hover:text-primary-500">
                  Add a new property
                </Link>
              </p>
            </div>
            
            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail. Include information about what you need, any specific requirements, and any other details that would help service providers give you an accurate estimate."
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="budget_min" className="block text-sm font-medium text-gray-700">
                Minimum Budget (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="budget_min"
                  id="budget_min"
                  step="0.01"
                  min="0"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={formData.budget_min}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="budget_max" className="block text-sm font-medium text-gray-700">
                Maximum Budget (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="budget_max"
                  id="budget_max"
                  step="0.01"
                  min="0"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={formData.budget_max}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="timeline_start" className="block text-sm font-medium text-gray-700">
                Preferred Start Date (Optional)
              </label>
              <input
                type="date"
                name="timeline_start"
                id="timeline_start"
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.timeline_start}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="timeline_end" className="block text-sm font-medium text-gray-700">
                Preferred End Date (Optional)
              </label>
              <input
                type="date"
                name="timeline_end"
                id="timeline_end"
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.timeline_end}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              <select
                id="preferred_contact_method"
                name="preferred_contact_method"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.preferred_contact_method}
                onChange={handleInputChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="in_app">In-App Messaging</option>
              </select>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <div className="flex items-start mt-5">
                <div className="flex items-center h-5">
                  <input
                    id="is_urgent"
                    name="is_urgent"
                    type="checkbox"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    checked={formData.is_urgent}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is_urgent" className="font-medium text-gray-700">
                    This is an urgent request
                  </label>
                  <p className="text-gray-500">Mark this if you need service providers to respond quickly.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to="/homeowner/estimate-requests"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewEstimateRequest
