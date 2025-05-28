import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ProviderJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch jobs from your database
      // For demo purposes, we'll use mock data
      
      // Mock jobs data
      const mockJobs = [
        {
          id: 1,
          title: 'Kitchen Renovation',
          client: 'John Smith',
          date: new Date(2023, 4, 15, 10, 0),
          address: '123 Main St, Anytown, CA',
          status: 'scheduled',
          price: 3500,
          description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.'
        },
        {
          id: 2,
          title: 'Bathroom Plumbing',
          client: 'Sarah Johnson',
          date: new Date(2023, 4, 16, 14, 30),
          address: '456 Oak Ave, Somewhere, CA',
          status: 'confirmed',
          price: 850,
          description: 'Fix leaking pipes and install new shower fixtures.'
        },
        {
          id: 3,
          title: 'Deck Installation',
          client: 'Michael Brown',
          date: new Date(2023, 4, 18, 9, 0),
          address: '789 Pine Rd, Nowhere, CA',
          status: 'pending',
          price: 2200,
          description: 'Build a new 12x16 wooden deck with railings and stairs.'
        },
        {
          id: 4,
          title: 'Interior Painting',
          client: 'Emily Wilson',
          date: new Date(2023, 4, 5, 13, 0),
          address: '101 Elm St, Anytown, CA',
          status: 'completed',
          price: 1200,
          description: 'Paint living room, dining room, and hallway. Includes primer and two coats of paint.'
        },
        {
          id: 5,
          title: 'Roof Repair',
          client: 'David Lee',
          date: new Date(2023, 4, 2, 11, 0),
          address: '202 Cedar Ave, Somewhere, CA',
          status: 'completed',
          price: 950,
          description: 'Repair damaged shingles and fix leak in roof.'
        },
        {
          id: 6,
          title: 'Fence Installation',
          client: 'Jennifer Garcia',
          date: new Date(2023, 4, 20, 8, 0),
          address: '303 Maple Dr, Nowhere, CA',
          status: 'pending',
          price: 1800,
          description: 'Install 100 feet of 6-foot privacy fence around backyard.'
        },
        {
          id: 7,
          title: 'Electrical Wiring',
          client: 'Robert Martinez',
          date: new Date(2023, 3, 28, 15, 0),
          address: '404 Birch Ln, Anytown, CA',
          status: 'completed',
          price: 750,
          description: 'Update electrical panel and add new outlets in home office.'
        },
        {
          id: 8,
          title: 'Landscaping',
          client: 'Lisa Anderson',
          date: new Date(2023, 4, 25, 10, 0),
          address: '505 Spruce Ct, Somewhere, CA',
          status: 'scheduled',
          price: 1500,
          description: 'Redesign front yard with new plants, mulch, and decorative stones.'
        }
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on status and search term
  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? a.date - b.date : b.date - a.date;
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'client') {
      return sortOrder === 'asc' 
        ? a.client.localeCompare(b.client) 
        : b.client.localeCompare(a.client);
    }
    return 0;
  });

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="mr-1 h-4 w-4" />
            Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Confirmed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
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
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                  Filter by status
                </label>
                <select
                  id="filter"
                  name="filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Jobs</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setSortOrder('asc');
                  }}
                >
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                  <option value="title">Job Title</option>
                  <option value="client">Client Name</option>
                </select>
              </div>
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <select
                  id="order"
                  name="order"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs list */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
                  <li key={job.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">{job.title}</p>
                          <div className="ml-2">
                            {getStatusBadge(job.status)}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${job.price}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Client: {job.client}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {job.address}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {format(job.date, 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{job.description}</p>
                      </div>
                      <div className="mt-3 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <EyeIcon className="mr-1 h-4 w-4" />
                          View Details
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ChatBubbleLeftRightIcon className="mr-1 h-4 w-4" />
                          Message Client
                        </button>
                        {job.status !== 'completed' && job.status !== 'cancelled' && (
                          <>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <PencilIcon className="mr-1 h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XCircleIcon className="mr-1 h-4 w-4" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500">
                  No jobs found matching your criteria
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderJobs;
