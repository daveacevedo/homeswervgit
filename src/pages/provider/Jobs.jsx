import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProvider } from '../../contexts/ProviderContext';
import { 
  BriefcaseIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Jobs = () => {
  const { providerProfile } = useProvider();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // Simulate fetching data
    const fetchJobs = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockJobs = [
          {
            id: 'job-1',
            title: 'Bathroom Renovation',
            description: 'Complete renovation of master bathroom including new fixtures, tile, and vanity',
            status: 'in_progress',
            client: {
              id: 'client-1',
              name: 'Sarah Johnson',
              address: '123 Main St, Anytown, CA',
              avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            startDate: '2023-10-01',
            estimatedEndDate: '2023-12-15',
            progress: 65,
            budget: 12500,
            amountPaid: 8125,
            nextMilestone: 'Tile Installation',
            nextMilestoneDate: '2023-11-15',
            priority: 'high',
            lastUpdated: '2023-11-02T14:30:00'
          },
          {
            id: 'job-2',
            title: 'Kitchen Sink Repair',
            description: 'Replace leaking kitchen sink and install new faucet',
            status: 'scheduled',
            client: {
              id: 'client-2',
              name: 'Michael Chen',
              address: '456 Oak Ave, Somewhere, CA',
              avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            startDate: '2023-11-12',
            estimatedEndDate: '2023-11-12',
            progress: 0,
            budget: 450,
            amountPaid: 0,
            priority: 'medium',
            lastUpdated: '2023-10-28T09:15:00'
          },
          {
            id: 'job-3',
            title: 'Bathroom Faucet Installation',
            description: 'Install new bathroom faucet in master bathroom',
            status: 'completed',
            client: {
              id: 'client-3',
              name: 'Emily Rodriguez',
              address: '789 Pine St, Elsewhere, CA',
              avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            startDate: '2023-10-28',
            completedDate: '2023-10-28',
            progress: 100,
            budget: 350,
            amountPaid: 350,
            priority: 'medium',
            lastUpdated: '2023-10-28T16:45:00',
            rating: 5,
            review: 'Excellent work! Very professional and completed the job quickly.'
          },
          {
            id: 'job-4',
            title: 'Water Heater Replacement',
            description: 'Replace old water heater with new energy-efficient model',
            status: 'pending',
            client: {
              id: 'client-4',
              name: 'David Wilson',
              address: '101 Elm St, Somewhere, CA',
              avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            estimatedStartDate: '2023-11-20',
            estimatedEndDate: '2023-11-21',
            progress: 0,
            estimatedBudget: 1200,
            amountPaid: 0,
            priority: 'high',
            lastUpdated: '2023-11-01T10:30:00'
          },
          {
            id: 'job-5',
            title: 'Pipe Repair',
            description: 'Fix leaking pipe under kitchen sink',
            status: 'on_hold',
            client: {
              id: 'client-5',
              name: 'Jennifer Lee',
              address: '202 Cedar St, Anytown, CA',
              avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            },
            startDate: '2023-10-15',
            progress: 25,
            budget: 300,
            amountPaid: 0,
            priority: 'medium',
            holdReason: 'Waiting for parts',
            lastUpdated: '2023-10-18T11:45:00'
          }
        ];
        
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    // Filter jobs based on search term and status filter
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            On Hold
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
  
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Low Priority
          </span>
        );
      default:
        return null;
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Your Jobs
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your client jobs
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
      
      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search jobs
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search jobs by title, description, client, or location"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="status-filter"
                  name="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Jobs List */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {jobs.length === 0 
                ? "You haven't added any jobs yet."
                : "No jobs match your current filters."}
            </p>
            {jobs.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/provider/jobs/new"
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Add your first job
                </Link>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <li key={job.id}>
                <Link to={`/provider/jobs/${job.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(job.status)}
                        <div className="mt-2">
                          {getPriorityBadge(job.priority)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:flex sm:justify-between">
                      <div className="sm:flex items-center">
                        <div className="flex items-center">
                          <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <p className="text-sm text-gray-500">{job.client.name}</p>
                        </div>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                          </svg>
                          {job.client.address}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {formatCurrency(job.budget || job.estimatedBudget)}
                        {job.amountPaid > 0 && (
                          <span className="ml-1">
                            ({formatCurrency(job.amountPaid)} paid)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                          </svg>
                          {job.status === 'completed'
                            ? `Completed on ${formatDate(job.completedDate)}`
                            : job.status === 'pending'
                              ? `Planned start: ${formatDate(job.estimatedStartDate)}`
                              : `Started: ${formatDate(job.startDate)}`}
                        </p>
                        {job.estimatedEndDate && job.status !== 'completed' && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                            </svg>
                            Estimated completion: {formatDate(job.estimatedEndDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {job.status === 'in_progress' && (
                      <div className="mt-4">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-primary-600">
                                Progress: {job.progress}%
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-primary-600">
                                {formatCurrency(job.budget)}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                            <div
                              style={{ width: `${job.progress}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Next milestone:</span> {job.nextMilestone} (Due: {formatDate(job.nextMilestoneDate)})
                        </p>
                      </div>
                    )}
                    
                    {job.status === 'on_hold' && (
                      <div className="mt-2">
                        <p className="text-sm text-orange-600">
                          <ExclamationTriangleIcon className="inline h-4 w-4 mr-1" />
                          On hold: {job.holdReason}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500 text-right">
                      Last updated: {new Date(job.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Jobs;
