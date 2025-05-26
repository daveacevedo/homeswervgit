import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ReviewResponse({ reviewId }) {
  const [user, setUser] = useState(null);
  const [review, setReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user && reviewId) {
        fetchReview(user.id);
      }
    };
    
    getCurrentUser();
  }, [reviewId]);

  const fetchReview = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:homeowner_id (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          project:project_id (
            id,
            title
          )
        `)
        .eq('id', reviewId)
        .eq('provider_id', userId)
        .single();
      
      if (error) throw error;
      
      setReview(data);
      setResponseText(data.response_text || '');
    } catch (err) {
      console.error('Error fetching review:', err);
      setError('Failed to load review details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to respond to reviews');
      return;
    }
    
    if (!responseText.trim()) {
      setError('Please enter a response');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { error } = await supabase
        .from('reviews')
        .update({
          response_text: responseText.trim(),
          response_date: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('provider_id', user.id);
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Update local state
      setReview({
        ...review,
        response_text: responseText.trim(),
        response_date: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error && !review) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
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
    );
  }

  if (!review) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Review not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The review you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Review Response</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Respond to customer feedback to show your commitment to service quality.</p>
        </div>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {review.reviewer?.avatar_url ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={review.reviewer.avatar_url}
                    alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                  />
                ) : (
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {review.reviewer ? `${review.reviewer.first_name} ${review.reviewer.last_name}` : 'Anonymous User'}
              </p>
              <div className="mt-1 flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
              {review.project && (
                <p className="mt-1 text-sm text-gray-500">
                  Project: {review.project.title}
                </p>
              )}
              <div className="mt-2 text-sm text-gray-700">
                <p>{review.review_text || 'No comment provided.'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {success ? (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your response has been submitted successfully!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="response-text" className="block text-sm font-medium text-gray-700">
                Your Response
              </label>
              <div className="mt-1">
                <textarea
                  id="response-text"
                  name="response-text"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Respond to this review..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your response will be publicly visible to all users.
              </p>
            </div>
            
            <div className="mt-5">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  submitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
