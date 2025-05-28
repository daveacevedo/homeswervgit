import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProviderDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    totalEarnings: 0
  });
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchProviderData(session.user.id);
      }
    };

    getUser();
  }, []);

  const fetchProviderData = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch provider profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);
      
      // For demo purposes, we'll use mock data
      // In a real app, you would fetch this from your database
      
      // Mock stats
      setStats({
        totalJobs: 24,
        pendingJobs: 5,
        completedJobs: 19,
        totalEarnings: 4850
      });
      
      // Mock upcoming jobs
      setUpcomingJobs([
        {
          id: 1,
          title: 'Kitchen Renovation',
          client: 'John Smith',
          date: new Date(2023, 4, 15, 10, 0),
          address: '123 Main St, Anytown, CA',
          status: 'scheduled'
        },
        {
          id: 2,
          title: 'Bathroom Plumbing',
          client: 'Sarah Johnson',
          date: new Date(2023, 4, 16, 14, 30),
          address: '456 Oak Ave, Somewhere, CA',
          status: 'confirmed'
        },
        {
          id: 3,
          title: 'Deck Installation',
          client: 'Michael Brown',
          date: new Date(2023, 4, 18, 9, 0),
          address: '789 Pine Rd, Nowhere, CA',
          status: 'pending'
        }
      ]);
      
      // Mock recent reviews
      setRecentReviews([
        {
          id: 1,
          client: 'Emily Wilson',
          rating: 5,
          comment: 'Excellent work! Very professional and completed the job ahead of schedule.',
          date: new Date(2023, 4, 10)
        },
        {
          id: 2,
          client: 'David Lee',
          rating: 4,
          comment: 'Good quality work and reasonable pricing. Would hire again.',
          date: new Date(2023, 4, 5)
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Jobs Completed',
        data: [3, 5, 2, 4, 3, 2],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Revenue ($)',
        data: [750, 1200, 500, 900, 800, 700],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jobs'
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Performance'
      }
    }
  };

  // Helper function to render stars for ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Welcome section */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome back, {profile?.first_name || 'Provider'}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalJobs}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/provider/jobs" className="font-medium text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Jobs</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.pendingJobs}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/provider/jobs?status=pending" className="font-medium text-blue-600 hover:text-blue-500">
                  View pending
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.completedJobs}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/provider/jobs?status=completed" className="font-medium text-blue-600 hover:text-blue-500">
                  View completed
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">${stats.totalEarnings}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/provider/jobs" className="font-medium text-blue-600 hover:text-blue-500">
                  View details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and upcoming jobs */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
            <div className="mt-4 h-72">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Upcoming jobs */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Jobs</h3>
              <div className="mt-4 flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {upcomingJobs.length > 0 ? (
                    upcomingJobs.map((job) => (
                      <li key={job.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                              <CalendarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                            <p className="text-sm text-gray-500 truncate">Client: {job.client}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {format(job.date, 'MMM d, yyyy h:mm a')}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{job.address}</p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                job.status === 'scheduled'
                                  ? 'bg-green-100 text-green-800'
                                  : job.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500">No upcoming jobs</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/provider/calendar" className="font-medium text-blue-600 hover:text-blue-500">
                  View calendar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent reviews */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Reviews</h3>
            <div className="mt-4 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <li key={review.id} className="py-5">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{review.client}</h4>
                            <span className="ml-2 text-sm text-gray-500">
                              {format(review.date, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {review.rating} out of 5 stars
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-5 text-center text-gray-500">No reviews yet</li>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/profile" className="font-medium text-blue-600 hover:text-blue-500">
                View all reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
