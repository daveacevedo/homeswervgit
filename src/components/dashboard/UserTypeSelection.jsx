import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useHomeowner } from '../../contexts/HomeownerContext'

function UserTypeSelection() {
  const { user, createProviderProfile } = useAuth()
  const { createHomeownerProfile } = useHomeowner()
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    // Provider fields
    business_name: '',
    contact_name: '',
    phone: '',
    
    // Homeowner fields
    first_name: '',
    last_name: '',
    phone_homeowner: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
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
      setLoading(true)
      setError(null)
      
      if (userType === 'provider') {
        // Create provider profile
        await createProviderProfile({
          business_name: formData.business_name,
          contact_name: formData.contact_name,
          email: user.email,
          phone: formData.phone,
        })
        
        navigate('/provider/dashboard')
      } else if (userType === 'homeowner') {
        // Create homeowner profile
        await createHomeownerProfile({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: user.email,
          phone: formData.phone_homeowner,
        })
        
        navigate('/homeowner/dashboard')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      setError('Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to ServiceConnect Pro
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please select how you want to use our platform
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
          
          {!userType ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('provider')}
                  className="w-full flex justify-center py-6 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="mt-2 font-medium text-gray-900">Service Provider</div>
                    <p className="mt-1 text-xs text-gray-500">Offer services to homeowners</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('homeowner')}
                  className="w-full flex justify-center py-6 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div className="mt-2 font-medium text-gray-900">Homeowner</div>
                    <p className="mt-1 text-xs text-gray-500">Find services for your home</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {userType === 'provider' ? (
                <>
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="business_name"
                        name="business_name"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.business_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
                      Contact Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="contact_name"
                        name="contact_name"
                        type="text"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.contact_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone_homeowner" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone_homeowner"
                        name="phone_homeowner"
                        type="tel"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.phone_homeowner}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUserType('')}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Back to selection
                </button>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={loading}
                >
                  {loading ? 'Creating profile...' : 'Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection
