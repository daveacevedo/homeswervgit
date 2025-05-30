import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  ChatBubbleLeftRightIcon, 
  BellIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { homeownerProfile } = useHomeowner();
  const [projects, setProjects] = useState([]);
  const [providers, setProviders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setProjects([
          {
            id: 'proj-1',
            title: 'Bathroom Renovation',
            status: 'in_progress',
            provider: 'Ace Plumbing & Remodeling',
            progress: 65,
            nextMilestone: 'Tile Installation',
            dueDate: '2023-11-15'
          },
          {
            id: 'proj-2',
            title: 'Lawn Maintenance',
            status: 'scheduled',
            provider: 'Green Thumb Landscaping',
            progress: 0,
            nextMilestone: 'Initial Service',
            dueDate: '2023-11-10'
          },
          {
            id: 'proj-3',
            title: 'Electrical Panel Upgrade',
            status: 'completed',
            provider: 'Bright Spark Electric',
            progress: 100,
            completedDate: '2023-10-28'
          }
        ]);
        
        setProviders([
          {
            id: 'prov-1',
            name: 'Ace Plumbing & Remodeling',
            category: 'Plumbing',
            rating: 4.8,
            projects: 2,
            image: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            id: 'prov-2',
            name: 'Green Thumb Landscaping',
            category: 'Landscaping',
            rating: 4.6,
            projects: 1,
            image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          {
            id: 'prov-3',
            name: 'Bright Spark Electric',
            category: 'Electrical',
            rating: 4.9,
            projects: 1,
            image: 'https://images.pexels.com/photos/8961292/pexels-photo-8961292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
        ]);
        
        setNotifications([
          {
            id: 'notif-1',
            type: 'milestone',
            title: 'Milestone Completed',
            message: 'Plumbing rough-in has been completed for your Bathroom Renovation project',
            date: '2023-11-02T14:30:00',
            read: false
          },
          {
            id: 'notif-2',
            type: 'message',
            title: 'New Message',
            message: 'You have a new message from Ace Plumbing & Remodeling',
            date: '2023-11-01T09:15:00',
            read: true
          },
          {
            id: 'notif-3',
            type: 'payment',
            title: 'Payment Due',
            message: 'Payment for Tile Installation milestone is due on November 15',
            date: '2023-10-31T16:45:00',
            read: true
          }
        ]);
        
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
            Welcome back, {homeownerProfile?.firstName || user?.email}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your home projects
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/homeowner/projects/new"
            className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <WrenchScrewdriverIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Project
          </Link>
        </div>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Active Projects</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Your ongoing and upcoming home projects</p>
              </div>
              <Link to="/homeowner/projects" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              {projects.length === 0 ? (
                <div className="py-10 text-center">
                  <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new project.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/homeowner/projects/new"
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <WrenchScrewdriverIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      New Project
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {projects.filter(p => p.status !== 'completed').map((project) => (
                    <li key={project.id} className="px-4 py-4 sm:px-6">
                      <Link to={`/homeowner/projects/${project.id}`} className="block hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <WrenchScrewdriverIcon className="h-8 w-8 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{project.title}</p>
                              <p className="text-sm text-gray-500">{project.provider}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(project.status)}
                            {project.status === 'in_progress' && (
                              <div className="mt-2 w-32">
                                <div className="relative pt-1">
                                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    <div
                                      style={{ width: `${project.progress}%` }}
                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{project.progress}% complete</p>
                                </div>
                              </div>
                            )}
                            {project.status === 'scheduled' && (
                              <div className="mt-2 text-xs text-gray-500">
                                <CalendarIcon className="inline h-3 w-3 mr-1" />
                                Starts: {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        {project.status === 'in_progress' && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Next milestone:</span> {project.nextMilestone} (Due: {new Date(project.dueDate).toLocaleDateString()})
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
          
          {/* Recently Completed Projects */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recently Completed</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Projects that have been completed</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <ul className="divide-y divide-gray-200">
                {projects.filter(p => p.status === 'completed').map((project) => (
                  <li key={project.id} className="px-4 py-4 sm:px-6">
                    <Link to={`/homeowner/projects/${project.id}`} className="block hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-500">{project.provider}</p>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(project.status)}
                          <div className="mt-1 text-xs text-gray-500">
                            Completed: {new Date(project.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
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
              <Link to="/homeowner/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`px-4 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {notification.type === 'milestone' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                        {notification.type === 'message' && (
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === 'payment' && (
                          <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />
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
          
          {/* Your Providers */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Your Providers</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Service providers you've worked with</p>
              </div>
              <Link to="/homeowner/providers" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Find new
              </Link>
            </div>
            
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {providers.map((provider) => (
                  <li key={provider.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={provider.image}
                          alt={provider.name}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-500">{provider.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{provider.category}</p>
                        <p className="text-xs text-gray-400">{provider.projects} project{provider.projects !== 1 ? 's' : ''}</p>
                      </div>
                      <Link
                        to={`/homeowner/messages?provider=${provider.id}`}
                        className="ml-2 inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
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
                  to="/homeowner/projects/new"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <WrenchScrewdriverIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  New Project
                </Link>
                <Link
                  to="/homeowner/messages"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <ChatBubbleLeftRightIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Messages
                </Link>
                <Link
                  to="/homeowner/providers"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <HomeIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Find Providers
                </Link>
                <Link
                  to="/homeowner/profile"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Notifications
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
