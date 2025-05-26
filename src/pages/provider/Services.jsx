import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Services() {
  const { providerProfile } = useAuth()
  const [services, setServices] = useState([])
  const [providerServices, setProviderServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [formData, setFormData] = useState({
    service_id: '',
    price: '',
    description: '',
    is_available: true
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    if (providerProfile) {
      fetchServices()
      fetchProviderServices()
    }
  }, [providerProfile])
  
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }
  
  const fetchProviderServices = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          *,
          services (
            id,
            name,
            description
          )
        `)
        .eq('provider_id', providerProfile.id)
      
      if (error) throw error
      
      setProviderServices(data || [])
    } catch (error) {
      console.error('Error fetching provider services:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleAddService = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      // Check if service already exists for this provider
      const existingService = providerServices.find(
        ps => ps.service_id === formData.service_id
      )
      
      if (existingService) {
        setError('You already offer this service. Please edit the existing service instead.')
        return
      }
      
      const serviceData = {
        provider_id: providerProfile.id,
        service_id: formData.service_id,
        price: parseFloat(formData.price),
        description: formData.description,
        is_available: formData.is_available
      }
      
      const { data, error } = await supabase
        .from('provider_services')
        .insert([serviceData])
        .select(`
          *,
          services (
            id,
            name,
            description
          )
        `)
      
      if (error) throw error
      
      // Add the new service to the list
      setProviderServices([...providerServices, data[0]])
      
      // Reset form
      setFormData({
        service_id: '',
        price: '',
        description: '',
        is_available: true
      })
      
      setShowAddForm(false)
      setSuccess('Service added successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding service:', error)
      setError('Failed to add service. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleEditService = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      const serviceData = {
        price: parseFloat(formData.price),
        description: formData.description,
        is_available: formData.is_available
      }
      
      const { data, error } = await supabase
        .from('provider_services')
        .update(serviceData)
        .eq('id', currentService.id)
        .select(`
          *,
          services (
            id,
            name,
            description
          )
        `)
      
      if (error) throw error
      
      // Update the service in the list
      setProviderServices(
        providerServices.map(service => 
          service.id === currentService.id ? data[0] : service
        )
      )
      
      setShowEditForm(false)
      setCurrentService(null)
      setSuccess('Service updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating service:', error)
      setError('Failed to update service. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to remove this service?')) {
      return
    }
    
    try {
      setError(null)
      
      const { error } = await supabase
        .from('provider_services')
        .delete()
        .eq('id', serviceId)
      
      if (error) throw error
      
      // Remove the service from the list
      setProviderServices(
        providerServices.filter(service => service.id !== serviceId)
      )
      
      setSuccess('Service removed successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error deleting service:', error)
      setError('Failed to remove service. Please try again.')
    }
  }
  
  const openEditForm = (service) => {
    setCurrentService(service)
    setFormData({
      service_id: service.service_id,
      price: service.price,
      description: service.description,
      is_available: service.is_available
    })
    setShowEditForm(true)
  }
  
  const getAvailableServices = () => {
    // Filter out services that the provider already offers
    const existingServiceIds = providerServices.map(ps => ps.service_id)
    return services.filter(service => !existingServiceIds.includes(service.id))
  }
  
  if (loading && providerServices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the services you offer to customers.
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
      
      {/* Services List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your Services</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Services you currently offer to customers.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Service
          </button>
        </div>
        
        {providerServices.length > 0 ? (
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {providerServices.map((service) => (
                <li key={service.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service.services.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.description || service.services.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6 text-sm text-gray-900 font-medium">
                        ${service.price.toFixed(2)}
                      </div>
                      <div className="mr-6">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(service)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-4 py-5 text-center text-gray-500 border-t border-gray-200">
            <p>You haven't added any services yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add your first service
            </button>
          </div>
        )}
      </div>
      
      {/* Add Service Modal */}
      {showAddForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Service
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleAddService}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                              Service Type
                            </label>
                            <select
                              id="service_id"
                              name="service_id"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={formData.service_id}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select a service</option>
                              {getAvailableServices().map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price ($)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="0.01"
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="description"
                                name="description"
                                rows="3"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Describe your service, including any special features or limitations."
                                value={formData.description}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="is_available"
                              name="is_available"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.is_available}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                              Available for booking
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                            disabled={submitting}
                          >
                            {submitting ? 'Adding...' : 'Add Service'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Service Modal */}
      {showEditForm && currentService && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Edit Service: {currentService.services.name}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleEditService}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price ($)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="0.01"
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="description"
                                name="description"
                                rows="3"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Describe your service, including any special features or limitations."
                                value={formData.description}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="is_available"
                              name="is_available"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.is_available}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                              Available for booking
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                            disabled={submitting}
                          >
                            {submitting ? 'Updating...' : 'Update Service'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            onClick={() => {
                              setShowEditForm(false)
                              setCurrentService(null)
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services
