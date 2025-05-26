import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const EstimateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('provider');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId || '');
  const [providerServices, setProviderServices] = useState([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      provider_id: providerId || '',
      service_id: '',
      project_description: '',
      budget_range: '',
      timeline: 'flexible',
      preferred_contact_method: 'email',
      preferred_contact_time: 'anytime',
      property_details: '',
      additional_info: ''
    }
  });
  
  const watchProviderId = watch('provider_id');
  
  useEffect(() => {
    fetchProviders();
    fetchServices();
  }, []);
  
  useEffect(() => {
    if (watchProviderId) {
      fetchProviderServices(watchProviderId);
    } else {
      setProviderServices([]);
    }
  }, [watchProviderId]);
  
  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, business_name')
        .eq('is_active', true)
        .order('business_name');
      
      if (error) throw error;
      
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load service providers');
    }
  };
  
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    }
  };
  
  const fetchProviderServices = async (providerId) => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          service_id,
          services (
            id,
            name
          )
        `)
        .eq('provider_id', providerId);
      
      if (error) throw error;
      
      setProviderServices(data || []);
      
      // Reset service selection if the current selection is not offered by this provider
      const serviceIds = data.map(item => item.service_id);
      const currentServiceId = watch('service_id');
      if (currentServiceId && !serviceIds.includes(currentServiceId)) {
        setValue('service_id', '');
      }
    } catch (error) {
      console.error('Error fetching provider services:', error);
      setError('Failed to load provider services');
    }
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add user_id to the data
      const estimateRequestData = {
        ...data,
        user_id: user.id,
        status: 'pending'
      };
      
      const { data: result, error } = await supabase
        .from('estimate_requests')
        .insert([estimateRequestData]);
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/homeowner/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting estimate request:', error);
      setError('Failed to submit estimate request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request an Estimate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to request an estimate from a service provider.
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
      
      {success ? (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your estimate request has been submitted successfully. You will be redirected to your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Provider Selection */}
            <div className="sm:col-span-3">
              <label htmlFor="provider_id" className="block text-sm font-medium text-gray-700">
                Service Provider
              </label>
              <div className="mt-1">
                <select
                  id="provider_id"
                  {...register('provider_id', { required: 'Please select a provider' })}
                  className={`shadow-sm ${errors.provider_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm rounded-md`}
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.business_name}
                    </option>
                  ))}
                </select>
                {errors.provider_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.provider_id.message}</p>
                )}
              </div>
            </div>
            
            {/* Service Selection */}
            <div className="sm:col-span-3">
              <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <div className="mt-1">
                <select
                  id="service_id"
                  {...register('service_id', { required: 'Please select a service' })}
                  className={`shadow-sm ${errors.service_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm rounded-md`}
                  disabled={!watchProviderId || providerServices.length === 0}
                >
                  <option value="">Select a service</option>
                  {watchProviderId && providerServices.length > 0 ? (
                    providerServices.map((item) => (
                      <option key={item.service_id} value={item.service_id}>
                        {item.services?.name}
                      </option>
                    ))
                  ) : (
                    services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.service_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.service_id.message}</p>
                )}
                {watchProviderId && providerServices.length === 0 && (
                  <p className="mt-2 text-sm text-yellow-600">This provider hasn't listed any services yet. Please select a different provider or contact them directly.</p>
                )}
              </div>
            </div>
            
            {/* Project Description */}
            <div className="sm:col-span-6">
              <label htmlFor="project_description" className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <div className="mt-1">
                <textarea
                  id="project_description"
                  rows={4}
                  {...register('project_description', { 
                    required: 'Please provide a project description',
                    minLength: { value: 20, message: 'Description must be at least 20 characters' }
                  })}
                  className={`shadow-sm ${errors.project_description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm rounded-md`}
                  placeholder="Describe your project in detail, including what you need done, any specific requirements, and your goals."
                />
                {errors.project_description && (
                  <p className="mt-2 text-sm text-red-600">{errors.project_description.message}</p>
                )}
              </div>
            </div>
            
            {/* Budget Range */}
            <div className="sm:col-span-3">
              <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700">
                Budget Range
              </label>
              <div className="mt-1">
                <select
                  id="budget_range"
                  {...register('budget_range', { required: 'Please select a budget range' })}
                  className={`shadow-sm ${errors.budget_range ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm rounded-md`}
                >
                  <option value="">Select a budget range</option>
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                  <option value="Not sure">Not sure (need guidance)</option>
                </select>
                {errors.budget_range && (
                  <p className="mt-2 text-sm text-red-600">{errors.budget_range.message}</p>
                )}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="sm:col-span-3">
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                Timeline
              </label>
              <div className="mt-1">
                <select
                  id="timeline"
                  {...register('timeline')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                >
                  <option value="flexible">Flexible (No specific deadline)</option>
                  <option value="asap">As soon as possible</option>
                  <option value="within_week">Within a week</option>
                  <option value="within_month">Within a month</option>
                  <option value="1_3_months">1-3 months</option>
                  <option value="3_6_months">3-6 months</option>
                  <option value="6_plus_months">6+ months</option>
                </select>
              </div>
            </div>
            
            {/* Preferred Contact Method */}
            <div className="sm:col-span-3">
              <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700">
                Preferred Contact Method
              </label>
              <div className="mt-1">
                <select
                  id="preferred_contact_method"
                  {...register('preferred_contact_method')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                  <option value="app">In-App Message</option>
                </select>
              </div>
            </div>
            
            {/* Preferred Contact Time */}
            <div className="sm:col-span-3">
              <label htmlFor="preferred_contact_time" className="block text-sm font-medium text-gray-700">
                Preferred Contact Time
              </label>
              <div className="mt-1">
                <select
                  id="preferred_contact_time"
                  {...register('preferred_contact_time')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                >
                  <option value="anytime">Anytime</option>
                  <option value="morning">Morning (8am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-9pm)</option>
                  <option value="weekends_only">Weekends Only</option>
                </select>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="sm:col-span-6">
              <label htmlFor="property_details" className="block text-sm font-medium text-gray-700">
                Property Details
              </label>
              <div className="mt-1">
                <textarea
                  id="property_details"
                  rows={3}
                  {...register('property_details')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                  placeholder="Provide details about your property that might be relevant to the project (e.g., age of home, square footage, any existing issues)."
                />
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="sm:col-span-6">
              <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <div className="mt-1">
                <textarea
                  id="additional_info"
                  rows={3}
                  {...register('additional_info')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                  placeholder="Any other details you'd like to share with the service provider."
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EstimateRequest;
