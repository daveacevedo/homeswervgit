import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';

const WriteReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('provider');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      provider_id: providerId || '',
      rating: 0,
      comment: '',
      project_details: '',
      project_date: '',
      is_anonymous: false
    }
  });
  
  const watchProviderId = watch('provider_id');
  
  useEffect(() => {
    fetchProviders();
    
    if (providerId) {
      fetchProviderDetails(providerId);
    }
    
    // Set the rating in the form when it changes
    setValue('rating', rating);
  }, [providerId, rating]);
  
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
  
  const fetchProviderDetails = async (id) => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setSelectedProvider(data);
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setError('Failed to load provider details');
    }
  };
  
  useEffect(() => {
    if (watchProviderId && watchProviderId !== providerId) {
      fetchProviderDetails(watchProviderId);
    }
  }, [watchProviderId]);
  
  const handleRatingClick = (value) => {
    setRating(value);
  };
  
  const handleRatingHover = (value) => {
    setHoverRating(value);
  };
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (data.rating === 0) {
        setError('Please select a rating');
        setLoading(false);
        return;
      }
      
      // Add user_id to the data
      const reviewData = {
        ...data,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      const { data: result, error } = await supabase
        .from('provider_reviews')
        .insert([reviewData]);
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/providers/${data.provider_id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Write a Review</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share your experience with a service provider to help others in the community.
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
                <p>Your review has been submitted successfully. You will be redirected to the provider's profile.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Provider Selection */}
            <div className="sm:col-span-6">
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
            
            {/* Provider Info */}
            {selectedProvider && (
              <div className="sm:col-span-6 bg-gray-50 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {selectedProvider.logo_url ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={selectedProvider.logo_url}
                        alt={selectedProvider.business_name}
                      />
                    ) : (
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedProvider.business_name}</h3>
                    <p className="text-sm text-gray-500">{selectedProvider.service_area || 'Service area not specified'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Rating */}
            <div className="sm:col-span-6">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="mt-1 flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <StarIcon
                      key={value}
                      className={`h-8 w-8 cursor-pointer ${
                        (hoverRating || rating) >= value
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => handleRatingHover(value)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {rating === 0
                    ? 'Click to rate'
                    : rating === 1
                    ? 'Poor'
                    : rating === 2
                    ? 'Fair'
                    : rating === 3
                    ? 'Good'
                    : rating === 4
                    ? 'Very Good'
                    : 'Excellent'}
                </span>
              </div>
              <input type="hidden" {...register('rating')} />
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>
            
            {/* Review Comment */}
            <div className="sm:col-span-6">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <div className="mt-1">
                <textarea
                  id="comment"
                  rows={4}
                  {...register('comment', { 
                    required: 'Please provide a review comment',
                    minLength: { value: 10, message: 'Review must be at least 10 characters' }
                  })}
                  className={`shadow-sm ${errors.comment ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm rounded-md`}
                  placeholder="Share your experience with this provider. What went well? What could have been better?"
                />
                {errors.comment && (
                  <p className="mt-2 text-sm text-red-600">{errors.comment.message}</p>
                )}
              </div>
            </div>
            
            {/* Project Details */}
            <div className="sm:col-span-6">
              <label htmlFor="project_details" className="block text-sm font-medium text-gray-700">
                Project Details (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="project_details"
                  rows={3}
                  {...register('project_details')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                  placeholder="Describe the project or service you hired this provider for."
                />
              </div>
            </div>
            
            {/* Project Date */}
            <div className="sm:col-span-3">
              <label htmlFor="project_date" className="block text-sm font-medium text-gray-700">
                Project Date (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="project_date"
                  {...register('project_date')}
                  className="shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
                />
              </div>
            </div>
            
            {/* Anonymous Review */}
            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="is_anonymous"
                    type="checkbox"
                    {...register('is_anonymous')}
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is_anonymous" className="font-medium text-gray-700">
                    Post anonymously
                  </label>
                  <p className="text-gray-500">
                    Your name will not be displayed with this review.
                  </p>
                </div>
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
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WriteReview;
