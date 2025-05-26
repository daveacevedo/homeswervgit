import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useHomeowner } from '../../contexts/HomeownerContext'

function NewBooking() {
  const { user } = useAuth()
  const { properties } = useHomeowner()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    provider_id: queryParams.get('provider') || '',
    service_id: queryParams.get('service') || '',
    property_id: queryParams.get('property') || '',
    start_time: '',
    duration: 60,
    notes: '',
    price: ''
  })
  
  useEffect(() => {
    fetchProviders()
    fetchServices()
    setLoading(false)
  }, [])
  
  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, business_name')
        .order('business_name')
      
      if (error) throw error
      
      setProviders(data || [])
    } catch (error) {
      console.error('Error fetching providers:', error)
      setError('Failed to load service providers')
    }
  }
  
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
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      // Validate form
      if (!formData.title || !formData.provider_id || !formData.service_id || !formData.property_id || !formData.start_time) {
        throw new Error('Please fill in all required fields')
      }
      
      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            homeowner_id: user.id,
            provider_id: formData.provider_id,
            service_id: formData.service_id,
            property_id: formData.property_id,
            title: formData.title,
            start_time: new Date(formData.start_time).toISOString(),
            duration: parseInt(formData.duration, 10) || 60,
            notes: formData.notes,
            price: formData.price ? parseFloat(formData.price) : null,
            status: 'scheduled'
          }
        ])
        .select()
      
      if (error) throw error
      
      // Navigate to booking detail page
      navigate(`/homeowner/bookings/${data[0].id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      setError(error.message || 'Failed to create booking')
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
        <h1 className="text-2xl font-bold text-gray-900">Schedule a Service</h1>
        <p className="mt-1 text-sm text-gray-500">
          Book an appointment with a service provider.
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
                Booking Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Kitchen Plumbing Repair"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="provider_id" className="block text-sm font-medium text-gray-700">
                Service Provider *
              </label>
              <select
                id="provider_id"
                name="provider_id"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.provider_id}
                onChange={handleInputChange}
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.business_name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                <Link to="/homeowner/find-providers" className="text-primary-600 hover:text-primary-500">
                  Find more service providers
                </Link>
              </p>
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
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="start_time"
                id="start_time"
                required
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.start_time}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                id="duration"
                min="15"
                step="15"
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="60"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.01"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional details or instructions for the service provider..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              to="/homeowner/bookings"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={submitting}
            >
              {submitting ? 'Scheduling...' : 'Schedule Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewBooking
