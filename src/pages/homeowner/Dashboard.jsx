import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Import Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function HomeownerDashboard() {
  const { user } = useAuth();
  const { userProfile } = useApp();
  const [projects, setProjects] = useState([]);
  const [recentProviders, setRecentProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for the dashboard
  const projectStatusData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [4, 2, 3, 1],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Fetch projects and providers data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // In a real app, these would be actual queries to your Supabase tables
        // For now, we'll use mock data
        
        // Mock projects data
        const mockProjects = [
          {
            id: '1',
            title: 'Kitchen Renovation',
            description: 'Complete kitchen remodel including new cabinets, countertops, and appliances.',
            status: 'in_progress',
            start_date: '2023-05-15',
            end_date: '2023-06-30',
            budget: 15000,
            provider: {
              id: '101',
              name: 'Elite Home Renovations',
              avatar_url: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              rating: 4.8
            }
          },
          {
            id: '2',
            title: 'Bathroom Remodel',
            description: 'Update master bathroom with new shower, vanity, and fixtures.',
            status: 'pending',
            start_date: '2023-07-10',
            end_date: '2023-07-25',
            budget: 8000,
            provider: {
              id: '102',
              name: 'Modern Plumbing Solutions',
              avatar_url: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              rating: 4.6
            }
          },
          {
            id: '3',
            title: 'Deck Construction',
            description: 'Build a new composite deck in the backyard.',
            status: 'pending',
            start_date: '2023-08-05',
            end_date: '2023-08-20',
            budget: 12000,
            provider: null
          },
          {
            id: '4',
            title: 'Interior Painting',
            description: 'Paint living room, dining room, and hallway.',
            status: 'completed',
            start_date: '2023-04-10',
            end_date: '2023-04-15',
            budget: 3000,
            provider: {
              id: '103',
              name: 'Perfect Painting Co.',
              avatar_url: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              rating: 5.0
            }
          }
        ];
        
        // Mock recent providers data
        const mockProviders = [
          {
            id: '101',
            name: 'Elite Home Renovations',
            service_type: 'General Contractor',
            avatar_url: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 4.8,
            reviews: 124
          },
          {
            id: '102',
            name: 'Modern Plumbing Solutions',
            service_type: 'Plumbing',
            avatar_url: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 4.6,
            reviews: 89
          },
          {
            id: '103',
            name: 'Perfect Painting Co.',
            service_type: 'Painting',
            avatar_url: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 5.0,
            reviews: 56
          },
          {
            id: '104',
            name: 'Green Thumb Landscaping',
            service_type: 'Landscaping',
            avatar_url: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 4.7,
            reviews: 112
          }
        ];

        setProjects(mockProjects);
        setRecentProviders(mockProviders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            In Progress
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md">
        <p>{error}</p>
        <button
          className="mt-2 text-sm font-medium text-red-700 underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userProfile?.full_name || 'Homeowner'}!
        </h1>
        <p className="mt-1 text-gray-600">
          Here's an overview of your home improvement projects and services.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Total Projects</h2>
              <p className="text-2xl font-semibold text-gray-700">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Completed</h2>
              <p className="text-2xl font-semibold text-gray-700">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">In Progress</h2>
              <p className="text-2xl font-semibold text-gray-700">
                {projects.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Pending</h2>
              <p className="text-2xl font-semibold text-gray-700">
                {projects.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects and chart section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent projects */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
              <Link
                to="/homeowner/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Timeline</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {project.provider && (
                      <div className="flex items-center mt-4 space-x-2">
                        <img
                          src={project.provider.avatar_url}
                          alt={project.provider.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{project.provider.name}</p>
                          <div className="flex items-center">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">{project.provider.rating}</span>
                          </div>
                        </div>
                        <div className="flex-1"></div>
                        <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No projects found.</p>
                  <Link
                    to="/homeowner/projects/new"
                    className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create New Project
                  </Link>
                </div>
              )}
            </div>
            {projects.length > 0 && (
              <div className="px-6 py-4 bg-gray-50">
                <Link
                  to="/homeowner/projects/new"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  <PlusIcon className="w-5 h-5 mr-1" />
                  Create New Project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Project status chart */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Project Status</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <Doughnut 
                  data={projectStatusData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent providers */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Service Providers</h2>
          <Link
            to="/homeowner/providers"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProviders.length > 0 ? (
            <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
              {recentProviders.map((provider) => (
                <div key={provider.id} className="p-6">
                  <div className="flex items-center">
                    <img
                      src={provider.avatar_url}
                      alt={provider.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{provider.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{provider.reviews} reviews</span>
                  </div>
                  <div className="flex mt-4 space-x-2">
                    <button className="flex-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      View Profile
                    </button>
                    <button className="flex-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No recent service providers.</p>
              <Link
                to="/homeowner/providers"
                className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Find Service Providers
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeownerDashboard;
