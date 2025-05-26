import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import ReviewResponse from '../../components/provider/ReviewResponse';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function ReviewsManagement() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: [0, 0, 0, 0, 0]
  });
  const [filter, setFilter] = useState('all'); // all, responded, unresponded
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('reviews')
        .select(`
          *,
          reviewer:reviewer_id (
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
        .eq('provider_id', user.id);
      
      // Apply filter
      if (filter === 'responded') {
        query = query.not('response_text', 'is', null);
      } else if (filter === 'unresponded') {
        query = query.is('response_text', null);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setReviews(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        const total = data.length;
        const sum = data.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;
        
        // Calculate distribution
        const distribution = [0, 0, 0, 0, 0];
        data.forEach(review => {
          if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating - 1]++;
          }
        });
        
        setStats({
          total,
          average,
          distribution
        });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
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

  const handleRefresh = () => {
    fetchReviews();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reviews Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and respond to customer reviews
        </p>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
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
      
      {/* Review Stats */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Review Statistics</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
              </div>
            </div>
            
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 flex items-center">
                  {stats.average.toFixed(1)}
                  <span className="ml-2">{renderStars(Math.round(stats.average))}</span>
                </dd>
              </div>
            </div>
            
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.total > 0
                    ? `${Math.round((reviews.filter(r => r.response_text).length / stats.total) * 100)}%`
                    : '0%'}
                </dd>
              </div>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Rating Distribution</h3>
            <div className="mt-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-20 text-sm font-medium text-gray-900">
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </div>
                  <div className="w-full ml-4">
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-yellow-400 rounded-full"
                        style={{
                          width: stats.total > 0
                            ? `${(stats.distribution[rating - 1] / stats.total) * 100}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 ml-4 text-sm font-medium text-gray-500 text-right">
                    {stats.distribution[rating - 1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Customer Reviews</h2>
            <p className="mt-1 text-sm text-gray-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from your customers
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Reviews</option>
              <option value="responded">Responded</option>
              <option value="unresponded">Needs Response</option>
            </select>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
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
          </div>
        ) : reviews.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all'
                ? "You haven't received any reviews yet."
                : filter === 'responded'
                  ? "You haven't responded to any reviews yet."
                  : "You've responded to all reviews."}
            </p>
          </div>
        ) : (
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
                      
                      {review.response_text ? (
                        <div className="mt-4 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-900">Your Response:</p>
                          <p className="mt-1 text-sm text-gray-700">{review.response_text}</p>
                          {review.response_date && (
                            <p className="mt-1 text-xs text-gray-500">
                              Responded on {formatDate(review.response_date)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Respond to Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Response Form Modal */}
      {selectedReview && (
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
                      Respond to Review
                    </h3>
                    <div className="mt-4 w-full">
                      <ReviewResponse
                        reviewId={selectedReview.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setSelectedReview(null);
                    handleRefresh();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
