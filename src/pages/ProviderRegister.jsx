import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'

function ProviderRegister() {
  const { registerProvider } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  
  const password = watch('password', '')
  
  const onSubmit = async (data) => {
    if (step < 3) {
      setStep(step + 1)
      return
    }
    
    setIsLoading(true)
    try {
      const providerData = {
        business_name: data.businessName,
        contact_name: data.contactName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        description: data.description,
        license_number: data.licenseNumber,
        insurance_info: data.insuranceInfo
      }
      
      const { error } = await registerProvider(data.email, data.password, providerData)
      
      if (!error) {
        navigate('/login')
      }
    } catch (error) {
      console.error('Provider registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a Service Provider
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-xs mt-1">Business</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="text-xs mt-1">Verification</span>
              </div>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Account Information */}
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {/* Step 2: Business Information */}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="businessName"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.businessName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('businessName', { 
                        required: 'Business name is required'
                      })}
                    />
                    {errors.businessName && (
                      <p className="mt-2 text-sm text-red-600">{errors.businessName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="contactName"
                      type="text"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.contactName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('contactName', { 
                        required: 'Contact name is required'
                      })}
                    />
                    {errors.contactName && (
                      <p className="mt-2 text-sm text-red-600">{errors.contactName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      type="tel"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      {...register('phone', { 
                        required: 'Phone number is required'
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="mt-1">
                      <input
                        id="address"
                        type="text"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        {...register('address', { 
                          required: 'Address is required'
                        })}
                      />
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        id="city"
                        type="text"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        {...register('city', { 
                          required: 'City is required'
                        })}
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        id="state"
                        type="text"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.state ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        {...register('state', { 
                          required: 'State is required'
                        })}
                      />
                      {errors.state && (
                        <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="zip"
                        type="text"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.zip ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                        {...register('zip', { 
                          required: 'ZIP code is required'
                        })}
                      />
                      {errors.zip && (
                        <p className="mt-2 text-sm text-red-600">{errors.zip.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      rows={3}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="Describe your business and services..."
                      {...register('description', { 
                        required: 'Business description is required'
                      })}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {/* Step 3: Verification Information */}
            {step === 3 && (
              <>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number (if applicable)
                  </label>
                  <div className="mt-1">
                    <input
                      id="licenseNumber"
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      {...register('licenseNumber')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="insuranceInfo" className="block text-sm font-medium text-gray-700">
                    Insurance Information
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="insuranceInfo"
                      rows={3}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Describe your insurance coverage..."
                      {...register('insuranceInfo')}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                      errors.terms ? 'border-red-300' : ''
                    }`}
                    {...register('terms', { 
                      required: 'You must agree to the terms and conditions'
                    })}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
                )}
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`${step === 1 || step === 2 ? 'ml-auto' : 'w-full'} flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : step < 3 ? 'Continue' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProviderRegister
