import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProvider } from '../../contexts/ProviderContext';
import { 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { providerProfile } = useProvider();
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setJobs([
          {
            id: 'job-1',
            title: 'Bathroom Renovation',
            client: {
              id: 'client-1',
              name: 'Sarah Johnson',
              address: '123 Main St, Anytown, CA',
              avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            status: 'in_progress',
            progress: 65,
            nextMilestone: 'Tile Installation',
            dueDate: '2023-11-15',
            budget: 12500,
            amountPaid: 8125,
            startDate: '2023-10-01'
          },
          {
            id: 'job-2',
            title: 'Kitchen Sink Repair',
            client: {
              id: 'client-2',
              name: 'Michael Chen',
              address: '456 Oak Ave, Somewhere, CA',
              avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            status: 'scheduled',
            startDate: '2023-11-12',
            budget: 450,
            amountPaid: 0
          },
          {
            id: 'job-3',
            title: 'Bathroom Faucet Installation',
            client: {
              id: 'client-3',
              name: 'Emily Rodriguez',
              address: '789 Pine St, Elsewhere, CA',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            status: 'completed',
            completedDate: '2023-10-28',
            budget: 350,
            amountPaid: 350,
            rating: 5,
            review: 'Excellent work! Very professional and completed the job quickly.'
          }
        ]);
        
        setClients([
          {
            id: 'client-1',
            name: 'Sarah Johnson',
            address: '123 Main St, Anytown, CA',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            totalJobs: 2,
            totalSpent: 12850,
            lastJobDate: '2023-10-01'
          },
          {
            id: 'client-2',
            name: 'Michael Chen',
            address: '456 Oak Ave, Somewhere, CA',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            totalJobs: 1,
            totalSpent: 0,
            lastJobDate: '2023-11-12'
          },
          {
            id: 'client-3',
            name: 'Emily Rodriguez',
            address: '789 Pine St, Elsewhere, CA',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            totalJobs: 1,
            totalSpent: 350,
            lastJobDate: '2023-10-28'
          }
        ]);
        
        setNotifications([
          {
            id: 'notif-1',
            type: 'job_request',
            title: 'New Job Request',
            message: 'Sarah Johnson has requested a quote for "Bathroom Renovation"',
            date: '2023-11-02T14:30:00',
            read: false
          },
          {
            id: 'notif-2',
            type: 'message',
            title: 'New Message',
            message: 'You have a new message from Sarah Johnson',
            date: '2023-11-01T09:15:00',
            read: true
          },
          {
            id: 'notif-3',
            type: 'payment',
            title: 'Payment Received',
            message: 'You received a payment of $350 from Emily Rodriguez',
            date: '2023-10-28T16:45:00',
            read: true
          }
        ]);
        
        setStats({
          activeJobs: 2,
          completedJobs: 1,
          totalEarnings: 8475,
          pendingPayments: 4825,
          averageRating: 4.8,
          totalReviews: 15
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {providerProfile?.businessName || user?.email}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your business
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/provider/jobs/new"
            className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Job
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Active Jobs */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.activeJobs}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/jobs" className="font-medium text-primary-700 hover:text-primary-900">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        {/* Completed Jobs */}
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
              <Link to="/provider/jobs?status=completed" className="font-medium text-primary-700 hover:text-primary-900">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        {/* Total Earnings */}
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
                    <div className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalEarnings)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/finances" className="font-medium text-primary-700 hover:text-primary-900">
                View details
              </Link>
            </div>
          </div>
        </div>
        
        {/* Pending Payments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{formatCurrency(stats.pendingPayments)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/finances?filter=pending" className="font-medium text-primary-700 hover:text-primary-900">
                View details
              </Link>
            </div>
          </div>
        </div>
        
        {/* Average Rating */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.averageRating} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({stats.totalReviews} reviews)
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/reviews" className="font-medium text-primary-700 hover:text-primary-900">
                View all reviews
              </Link>
            </div>
          </div>
        </div>
        
        {/* Total Clients */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{clients.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/clients" className="font-medium text-primary-700 hover:text-primary-900">
                View all clients
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Active Jobs</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Your ongoing and upcoming jobs</p>
              </div>
              <Link to="/provider/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              {jobs.filter(job => job.status !== 'completed').length === 0 ? (
                <div className="py-10 text-center">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active jobs</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new job.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/provider/jobs/new"
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      Add Job
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {jobs.filter(job => job.status !== 'completed').map((job) => (
                    <li key={job.id} className="px-4 py-4 sm:px-6">
                      <Link to={`/provider/jobs/${job.id}`} className="block hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{job.title}</p>
                              <div className="flex items-center">
                                <img
                                  className="h-6 w-6 rounded-full mr-2"
                                  src={job.client.avatar}
                                  alt={job.client.name}
                                />
                                <p className="text-sm text-gray-500">{job.client.name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(job.status)}
                            {job.status === 'in_progress' && (
                              <div className="mt-2 w-32">
                                <div className="relative pt-1">
                                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    <div
                                      style={{ width: `${job.progress}%` }}
                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{job.progress}% complete</p>
                                </div>
                              </div>
                            )}
                            {job.status === 'scheduled' && (
                              <div className="mt-2 text-xs text-gray-500">
                                <CalendarIcon className="inline h-3 w-3 mr-1" />
                                Starts: {new Date(job.startDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                              </svg>
                              {job.client.address}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            {formatCurrency(job.budget)}
                            {job.amountPaid > 0 && (
                              <span className="ml-1">
                                ({formatCurrency(job.amountPaid)} paid)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {job.status === 'in_progress' && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Next milestone:</span> {job.nextMilestone} (Due: {new Date(job.dueDate).toLocaleDateString()})
                            </p>
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Recently Completed Jobs */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recently Completed</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Jobs that have been completed</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <ul className="divide-y divide-gray-200">
                {jobs.filter(job => job.status === 'completed').map((job) => (
                  <li key={job.id} className="px-4 py-4 sm:px-6">
                    <Link to={`/provider/jobs/${job.id}`} className="block hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{job.title}</p>
                            <div className="flex items-center">
                              <img
                                className="h-6 w-6 rounded-full mr-2"
                                src={job.client.avatar}
                                alt={job.client.name}
                              />
                              <p className="text-sm text-gray-500">{job.client.name}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(job.status)}
                          <div className="mt-1 text-xs text-gray-500">
                            Completed: {new Date(job.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {job.rating && (
                        <div className="mt-2 flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={`${
                                  job.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                                } h-4 w-4 flex-shrink-0`}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <p className="ml-2 text-sm text-gray-500">{job.review}</p>
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Overview</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Monthly job and revenue statistics</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Performance data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Charts and analytics will appear here as you complete more jobs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent updates and alerts</p>
              </div>
              <Link to="/provider/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`px-4 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {notification.type === 'job_request' && (
                          <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === 'message' && (
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === 'payment' && (
                          <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Recent Clients */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Clients</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Homeowners you've worked with</p>
              </div>
              <Link to="/provider/clients" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {clients.slice(0, 3).map((client) => (
                  <li key={client.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={client.avatar}
                          alt={client.name}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{client.name}</p>
                          <div className="text-sm text-gray-500">
                            {client.totalJobs} job{client.totalJobs !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{client.address}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-400">
                            Last job: {new Date(client.lastJobDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs font-medium text-gray-900">
                            {formatCurrency(client.totalSpent)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <Link
                  to="/provider/jobs/new"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <BriefcaseIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Add Job
                </Link>
                <Link
                  to="/provider/messages"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <ChatBubbleLeftRightIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Messages
                </Link>
                <Link
                  to="/provider/calendar"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Calendar
                </Link>
                <Link
                  to="/provider/settings"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
