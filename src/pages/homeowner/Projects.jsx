import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const HomeownerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch projects from your database
      // For demo purposes, we'll use mock data
      
      // Mock projects data
      const mockProjects = [
        {
          id: 1,
          title: 'Kitchen Renovation',
          description: 'Complete kitchen renovation with custom cabinets, quartz countertops, and new appliances.',
          status: 'in_progress',
          provider: 'Elite Home Renovations',
          provider_id: 101,
          start_date: new Date(2023, 3, 15),
          end_date: new Date(2023, 5, 30),
          budget: 45000,
          spent: 30000,
          image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 2,
          title: 'Bathroom Remodel',
          description: 'Full bathroom remodel including new shower, vanity, toilet, and tile work.',
          status: 'in_progress',
          provider: 'Premium Bathroom Solutions',
          provider_id: 102,
          start_date: new Date(2023, 4, 1),
          end_date: new Date(2023, 5, 15),
          budget: 25000,
          spent: 15000,
          image: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 3,
          title: 'Deck Installation',
          description: 'Built a new cedar deck with railings and stairs in the backyard.',
          status: 'completed',
          provider: 'Outdoor Living Experts',
          provider_id: 103,
          start_date: new Date(2023, 2, 10),
          end_date: new Date(2023, 3, 5),
          budget: 12000,
          spent: 11500,
          image: 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 4,
          title: 'Interior Painting',
          description: 'Painted living room, dining room, and hallway with premium paint.',
          status: 'completed',
          provider: 'Perfect Painting Services',
          provider_id: 104,
          start_date: new Date(2023, 1, 15),
          end_date: new Date(2023, 1, 25),
          budget: 5000,
          spent: 4800,
          image: 'https://images.pexels.com/photos/6444256/pexels-photo-6444256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 5,
          title: 'Roof Repair',
          description: 'Repaired damaged shingles and fixed leak in roof.',
          status: 'completed',
          provider: 'Top Notch Roofing',
          provider_id: 105,
          start_date: new Date(2023, 0, 5),
          end_date: new Date(2023, 0, 10),
          budget: 3000,
          spent: 2800,
          image: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
          id: 6,
          title: 'Landscaping Project',
          description: 'Front yard landscaping with new plants, mulch, and decorative stones.',
          status: 'pending',
          provider: 'Green Thumb Landscaping',
          provider_id: 106,
          start_date: new Date(2023, 5, 1),
          end_date: new Date(2023, 5, 15),
          budget: 8000,
          spent: 0,
          image: 'https://images.pexels.com/photos/589/garden-grass-lawn-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on status and search term
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? a.start_date - b.start_date : b.start_date - a.start_date;
    } else if (sortBy === 'budget') {
      return sortOrder === 'asc' ? a.budget - b.budget : b.budget - a.budget;
    } else if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'provider') {
      return sortOrder === 'asc' 
        ? a.provider.localeCompare(b.provider) 
        : b.provider.localeCompare(a.provider);
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
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="mr-1 h-4 w-4" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="mr-1 h-4 w-4" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationCircleIcon className="mr-1 h-4 w-4" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </span>
        );
    }
  };

  // Format date
  const formatDate = (date) => {
    return format(date, 'MMM d, yyyy');
  };

  // Calculate progress percentage
  const calculateProgress = (spent, budget) => {
    return Math.round((spent / budget) * 100);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
          </button>
        </div>
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
                  <option value="all">All Projects</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
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
                  <option value="budget">Budget</option>
                  <option value="title">Project Title</option>
                  <option value="provider">Provider Name</option>
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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.length > 0 ? (
            sortedProjects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                  <p className="mt-2 text-sm text-gray-700">Provider: {project.provider}</p>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Start: {formatDate(project.start_date)}</span>
                    <span>End: {formatDate(project.end_date)}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                      <span>Spent: ${project.spent.toLocaleString()} ({calculateProgress(project.spent, project.budget)}%)</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          project.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${calculateProgress(project.spent, project.budget)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/homeowner/projects/${project.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <EyeIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
              No projects found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeownerProjects;
