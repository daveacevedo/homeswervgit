import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const HomeownerDashboard = () => {
  const { userProfile, loading } = useApp();
  
  // Sample data for demonstration
  const upcomingAppointments = [
    { id: 1, provider: 'John Smith Plumbing', service: 'Bathroom Renovation', date: '2023-06-15', time: '10:00 AM' },
    { id: 2, provider: 'Elite Electrical', service: 'Wiring Inspection', date: '2023-06-18', time: '2:30 PM' },
  ];
  
  const activeProjects = [
    { id: 1, title: 'Kitchen Remodel', status: 'In Progress', completion: 65, provider: 'Modern Renovations' },
    { id: 2, title: 'Backyard Landscaping', status: 'Planning', completion: 20, provider: 'Green Thumb Landscaping' },
  ];
  
  const recentProviders = [
    { id: 1, name: 'John Smith', service: 'Plumbing', rating: 4.8, image: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 2, name: 'Sarah Johnson', service: 'Electrical', rating: 4.9, image: 'https://images.pexels.com/photos/8961258/pexels-photo-8961258.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 3, name: 'Mike Davis', service: 'Carpentry', rating: 4.7, image: 'https://images.pexels.com/photos/8961254/pexels-photo-8961254.jpeg?auto=compress&cs=tinysrgb&w=150' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userProfile?.full_name || 'Homeowner'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your home projects
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{activeProjects.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/homeowner/projects" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{upcomingAppointments.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/homeowner/calendar" className="font-medium text-blue-600 hover:text-blue-500">
                View calendar
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Saved Providers</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{recentProviders.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/homeowner/services" className="font-medium text-blue-600 hover:text-blue-500">
                Find providers
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Reward Points</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{userProfile?.rewards_points || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/homeowner/rewards" className="font-medium text-blue-600 hover:text-blue-500">
                View rewards
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Projects</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {activeProjects.map((project) => (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{project.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'In Progress' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/homeowner/projects/${project.id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <WrenchScrewdriverIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {project.provider}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{project.completion}% complete</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link
              to="/homeowner/projects"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <li key={appointment.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{appointment.service}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {appointment.provider}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link
              to="/homeowner/calendar"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Service Providers */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Service Providers</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentProviders.map((provider) => (
            <div key={provider.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img className="h-12 w-12 rounded-full" src={provider.image} alt={provider.name} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.service}</p>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                      <span className="ml-1 text-sm text-gray-500">{provider.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to={`/homeowner/services/${provider.id}`} className="font-medium text-blue-600 hover:text-blue-500">
                    View profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            to="/homeowner/services"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Find More Providers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
