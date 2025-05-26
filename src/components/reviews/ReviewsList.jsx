import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function ReviewsList({ providerId, limit = 5, showFilters = true }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, positive (4-5), negative (1-3)
  const [sort, setSort] = useState('newest'); // newest, oldest, highest, lowest

  useEffect(() => {
    if (providerId) {
      fetchReviews();
    }
  }, [providerId, filter, sort, limit]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
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
        .eq('provider_id', providerId);
      
      // Apply rating filter
      if (filter === 'positive') {
        query = query.gte('rating', 4);
      } else if (filter === 'negative') {
        query = query.lte('rating', 3);
      }
      
      // Apply sorting
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sort === 'highest') {
        query = query.order('rating', { ascending: false });
      } else if (sort === 'lowest') {
        query = query.order('rating', { ascending: true });
      }
      
      // Apply limit
      if (limit > 0) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-yellow-400" />
            )}
          </span>
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
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-3 h-4 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
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

  if (reviews.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            This provider hasn't received any reviews yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Reviews</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} • {calculateAverageRating()} average rating
            </p>
          </div>
          
          {showFilters && (
            <div className="flex space-x-2">
              <select
                className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="positive">Positive (4-5)</option>
                <option value="negative">Critical (1-3)</option>
              </select>
              
              <select
                className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <li key={review.id} className="px-4 py-5 sm:px-6">
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
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {review.reviewer ? `${review.reviewer.first_name} ${review.reviewer.last_name}` : 'Anonymous User'}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                  </div>
                  <div className="mt-1">
                    {renderStars(review.rating)}
                  </div>
                  {review.project && (
                    <p className="mt-1 text-sm text-gray-500">
                      Project: {review.project.title}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{review.review_text || 'No comment provided.'}</p>
                  </div>
                  
                  {review.response_text && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Response from provider:</p>
                      <p className="mt-1 text-sm text-gray-700">{review.response_text}</p>
                      {review.response_date && (
                        <p className="mt-1 text-xs text-gray-500">
                          Responded on {formatDate(review.response_date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
