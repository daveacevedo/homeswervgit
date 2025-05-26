import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

function Profile() {
  const { user, providerProfile, updateProviderProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    description: '',
    years_in_business: '',
    employees_count: '',
    license_number: '',
    insurance_info: '',
    service_area: '',
  })
  
  useEffect(() => {
    if (providerProfile) {
      setFormData({
        business_name: providerProfile.business_name || '',
        contact_name: providerProfile.contact_name || '',
        email: providerProfile.email || user?.email || '',
        phone: providerProfile.phone || '',
        website: providerProfile.website || '',
        address: providerProfile.address || '',
        city: providerProfile.city || '',
        state: providerProfile.state || '',
        zip: providerProfile.zip || '',
        description: providerProfile.description || '',
        years_in_business: providerProfile.years_in_business || '',
        employees_count: providerProfile.employees_count || '',
        license_number: providerProfile.license_number || '',
        insurance_info: providerProfile.insurance_info || '',
        service_area: providerProfile.service_area || '',
      })
    }
  }, [providerProfile, user])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await updateProviderProfile(formData)
      
      if (error) throw error
      
      setSuccess('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your business information and settings.
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Business Information</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your business details and contact information.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <form onSubmit={handleSubmit}>
            <div className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="col-span-3 space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Basic Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                          Business Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="business_name"
                            id="business_name"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.business_name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                          Contact Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="contact_name"
                            id="contact_name"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.contact_name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="website"
                            id="website"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.website}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Address</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address"
                            id="address"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                          ZIP / Postal Code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="zip"
                            id="zip"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.zip}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Business Details</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Business Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description of your business and services.
                        </p>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="years_in_business" className="block text-sm font-medium text-gray-700">
                          Years in Business
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="years_in_business"
                            id="years_in_business"
                            min="0"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.years_in_business}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="employees_count" className="block text-sm font-medium text-gray-700">
                          Number of Employees
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="employees_count"
                            id="employees_count"
                            min="1"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.employees_count}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                          License Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="license_number"
                            id="license_number"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.license_number}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="insurance_info" className="block text-sm font-medium text-gray-700">
                          Insurance Information
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="insurance_info"
                            id="insurance_info"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={formData.insurance_info}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="service_area" className="block text-sm font-medium text-gray-700">
                          Service Area
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="service_area"
                            id="service_area"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="e.g., 25 miles from Chicago, IL"
                            value={formData.service_area}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
