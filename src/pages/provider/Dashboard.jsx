import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const ProviderDashboard = () => {
  const { userProfile, loading } = useApp();
  
  // Sample data for demonstration
  const upcomingJobs = [
    { id: 1, client: 'Michael Johnson', service: 'Bathroom Renovation', date: '2023-06-15', time: '10:00 AM', address: '123 Main St, Anytown' },
    { id: 2, client: 'Sarah Williams', service: 'Electrical Wiring', date: '2023-06-18', time: '2:30 PM', address: '456 Oak Ave, Somewhere' },
  ];
  
  const recentClients = [
    { id: 1, name: 'Robert Davis', project: 'Kitchen Remodel', status: 'In Progress', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 2, name: 'Jennifer Smith', project: 'Backyard Landscaping', status: 'Completed', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 3, name: 'David Wilson', project: 'Roof Repair', status: 'Scheduled', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
  ];

  const monthlyStats = {
    completedJobs: 12,
    newClients: 5,
    revenue: 8750,
    satisfaction: 4.8
  };

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
          Welcome back, {userProfile?.full_name || 'Provider'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your business
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{monthlyStats.completedJobs}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/jobs" className="font-medium text-blue-600 hover:text-blue-500">
                View all jobs
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
                  <dt className="text-sm font-medium text-gray-500 truncate">New Clients</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{monthlyStats.newClients}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/clients" className="font-medium text-blue-600 hover:text-blue-500">
                View all clients
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${monthlyStats.revenue}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/finances" className="font-medium text-blue-600 hover:text-blue-500">
                View finances
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Client Satisfaction</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{monthlyStats.satisfaction}/5</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/provider/reviews" className="font-medium text-blue-600 hover:text-blue-500">
                View reviews
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {upcomingJobs.map((job) => (
              <li key={job.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{job.service}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {job.time}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/provider/jobs/${job.id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {job.client}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <p>
                        {job.address}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link
              to="/provider/calendar"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Full Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Clients</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentClients.map((client) => (
            <div key={client.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img className="h-12 w-12 rounded-full" src={client.image} alt={client.name} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.project}</p>
                    <div className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : client.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to={`/provider/clients/${client.id}`} className="font-medium text-blue-600 hover:text-blue-500">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            to="/provider/clients"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View All Clients
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/provider/jobs/new"
            className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-center">
                <BriefcaseIcon className="h-8 w-8 text-blue-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Add New Job</h3>
                <p className="mt-1 text-sm text-gray-500">Create a new job or quote</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/provider/calendar/new"
            className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-blue-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Schedule Appointment</h3>
                <p className="mt-1 text-sm text-gray-500">Add to your calendar</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/provider/clients/new"
            className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-blue-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Add New Client</h3>
                <p className="mt-1 text-sm text-gray-500">Create client profile</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/provider/invoices/new"
            className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-center">
                <CurrencyDollarIcon className="h-8 w-8 text-blue-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900">Create Invoice</h3>
                <p className="mt-1 text-sm text-gray-500">Bill your clients</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
