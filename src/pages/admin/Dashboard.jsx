import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Dashboard() {
  const { hasPermission } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Mock data for demonstration
  const mockStats = {
    users: {
      total: 1245,
      active: 987,
      new: 42,
      growth: 12.5
    },
    providers: {
      total: 328,
      verified: 275,
      pending: 53,
      growth: 8.3
    },
    projects: {
      total: 1876,
      active: 432,
      completed: 1444,
      growth: 15.2
    },
    revenue: {
      total: 125750,
      monthly: 28450,
      growth: 9.7
    }
  };

  const mockActivity = [
    { id: 1, type: 'user_signup', user: 'john.doe@example.com', timestamp: '2023-10-15T14:30:00Z' },
    { id: 2, type: 'provider_verification', provider: 'Elite Plumbing', status: 'approved', admin: 'admin@example.com', timestamp: '2023-10-15T13:45:00Z' },
    { id: 3, type: 'project_completed', project: 'Bathroom Renovation', homeowner: 'sarah@example.com', provider: 'Modern Renovations', timestamp: '2023-10-15T12:20:00Z' },
    { id: 4, type: 'payment_processed', amount: 1250, project: 'Kitchen Remodel', timestamp: '2023-10-15T11:10:00Z' },
    { id: 5, type: 'content_updated', page: 'Home Page', admin: 'editor@example.com', timestamp: '2023-10-15T10:05:00Z' },
    { id: 6, type: 'user_signup', user: 'mary.smith@example.com', timestamp: '2023-10-15T09:30:00Z' },
    { id: 7, type: 'provider_verification', provider: 'Green Landscaping', status: 'pending', timestamp: '2023-10-15T08:15:00Z' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setRecentActivity(mockActivity);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_signup':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          </div>
        );
      case 'provider_verification':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'project_completed':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
            <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
          </div>
        );
      case 'payment_processed':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'content_updated':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'user_signup':
        return (
          <div>
            <span className="font-medium text-gray-900">New user signup: </span>
            <span className="text-gray-500">{activity.user}</span>
          </div>
        );
      case 'provider_verification':
        return (
          <div>
            <span className="font-medium text-gray-900">Provider verification </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              activity.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {activity.status}
            </span>
            <span className="text-gray-500"> for {activity.provider}</span>
            {activity.admin && <span className="text-gray-500"> by {activity.admin}</span>}
          </div>
        );
      case 'project_completed':
        return (
          <div>
            <span className="font-medium text-gray-900">Project completed: </span>
            <span className="text-gray-500">{activity.project} by {activity.provider} for {activity.homeowner}</span>
          </div>
        );
      case 'payment_processed':
        return (
          <div>
            <span className="font-medium text-gray-900">Payment processed: </span>
            <span className="text-gray-500">{formatCurrency(activity.amount)} for {activity.project}</span>
          </div>
        );
      case 'content_updated':
        return (
          <div>
            <span className="font-medium text-gray-900">Content updated: </span>
            <span className="text-gray-500">{activity.page} by {activity.admin}</span>
          </div>
        );
      default:
        return <div className="text-gray-500">Unknown activity</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of platform metrics and recent activity
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Users Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.users.total.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                +{stats.users.new} new
              </span>
              <span className="text-gray-500"> in the last 30 days</span>
            </div>
          </div>
        </div>

        {/* Providers Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Service Providers</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.providers.total.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-yellow-600">
                {stats.providers.pending} pending verification
              </span>
            </div>
          </div>
        </div>

        {/* Projects Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.projects.total.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-600">
                {stats.projects.active} active
              </span>
              <span className="text-gray-500"> projects in progress</span>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Platform Revenue</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{formatCurrency(stats.revenue.total)}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                {formatCurrency(stats.revenue.monthly)}
              </span>
              <span className="text-gray-500"> this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-3 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    {getActivityDescription(activity)}
                    <p className="text-sm text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-6 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                View all activity
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
