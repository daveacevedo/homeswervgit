import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PauseCircleIcon,
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { hasPermission } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for demonstration
  const mockProjects = [
    { 
      id: 1, 
      title: 'Kitchen Renovation', 
      description: 'Complete kitchen remodel with new cabinets, countertops, and appliances',
      homeowner: 'Sarah Johnson',
      homeownerEmail: 'sarah.j@example.com',
      provider: 'Elite Home Renovations',
      providerEmail: 'info@eliterenovations.com',
      status: 'in_progress',
      category: 'Renovation',
      budget: 25000,
      startDate: '2023-09-15',
      estimatedEndDate: '2023-11-30',
      progress: 65,
      lastUpdated: '2023-10-15T14:30:00Z',
      address: '123 Main St, Austin, TX 78701',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 2, 
      title: 'Bathroom Remodel', 
      description: 'Master bathroom renovation with new shower, tub, and vanity',
      homeowner: 'Michael Brown',
      homeownerEmail: 'michael.b@example.com',
      provider: 'Modern Plumbing & Bath',
      providerEmail: 'contact@modernplumbing.com',
      status: 'completed',
      category: 'Renovation',
      budget: 18500,
      startDate: '2023-08-01',
      estimatedEndDate: '2023-09-30',
      progress: 100,
      lastUpdated: '2023-10-02T10:15:00Z',
      address: '456 Oak Ave, Dallas, TX 75201',
      image: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 3, 
      title: 'Backyard Landscaping', 
      description: 'Complete backyard redesign with new patio, plants, and irrigation system',
      homeowner: 'Jennifer Davis',
      homeownerEmail: 'jennifer.d@example.com',
      provider: 'Green Thumb Landscaping',
      providerEmail: 'info@greenthumb.com',
      status: 'pending',
      category: 'Landscaping',
      budget: 12000,
      startDate: '2023-11-01',
      estimatedEndDate: '2023-12-15',
      progress: 0,
      lastUpdated: '2023-10-10T09:45:00Z',
      address: '789 Pine Rd, Houston, TX 77002',
      image: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 4, 
      title: 'Roof Replacement', 
      description: 'Full roof replacement with architectural shingles',
      homeowner: 'Robert Wilson',
      homeownerEmail: 'robert.w@example.com',
      provider: 'Reliable Roofing',
      providerEmail: 'service@reliableroofing.com',
      status: 'on_hold',
      category: 'Roofing',
      budget: 15000,
      startDate: '2023-09-20',
      estimatedEndDate: '2023-10-15',
      progress: 35,
      lastUpdated: '2023-10-05T16:20:00Z',
      address: '101 Maple Dr, San Antonio, TX 78205',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 5, 
      title: 'Interior Painting', 
      description: 'Painting of all interior walls, ceilings, and trim',
      homeowner: 'Emily Taylor',
      homeownerEmail: 'emily.t@example.com',
      provider: 'Perfect Finish Painting',
      providerEmail: 'info@perfectfinish.com',
      status: 'scheduled',
      category: 'Painting',
      budget: 8500,
      startDate: '2023-10-25',
      estimatedEndDate: '2023-11-10',
      progress: 0,
      lastUpdated: '2023-10-12T11:30:00Z',
      address: '222 Elm St, Austin, TX 78704',
      image: 'https://images.pexels.com/photos/1669754/pexels-photo-1669754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 6, 
      title: 'Deck Construction', 
      description: 'New composite deck with railing and built-in seating',
      homeowner: 'David Miller',
      homeownerEmail: 'david.m@example.com',
      provider: 'Custom Decks & Patios',
      providerEmail: 'build@customdecks.com',
      status: 'cancelled',
      category: 'Construction',
      budget: 20000,
      startDate: '2023-08-15',
      estimatedEndDate: '2023-10-01',
      progress: 25,
      lastUpdated: '2023-09-15T13:10:00Z',
      address: '333 Cedar Blvd, Dallas, TX 75202',
      image: 'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
  ];

  const statusOptions = ['all', 'pending', 'scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled'];
  const categoryOptions = ['all', 'Renovation', 'Construction', 'Landscaping', 'Roofing', 'Painting', 'Plumbing', 'Electrical', 'HVAC', 'Flooring', 'Other'];
  const sortOptions = [
    { value: 'date', label: 'Date Updated' },
    { value: 'budget', label: 'Budget' },
    { value: 'progress', label: 'Progress' },
    { value: 'title', label: 'Title' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            In Progress
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-sm font-medium text-orange-800">
            <PauseCircleIcon className="h-4 w-4 mr-1" />
            On Hold
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'scheduled': return 'Scheduled';
      case 'in_progress': return 'In Progress';
      case 'on_hold': return 'On Hold';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortProjects = (projects) => {
    return [...projects].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
          break;
        case 'budget':
          comparison = a.budget - b.budget;
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.homeowner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProjects = sortProjects(filteredProjects);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Project Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor all projects across the platform
        </p>
      </div>
      
      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <label htmlFor="search" className="sr-only">
              Search projects
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="Search projects"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full sm:w-48">
            <select
              id="status"
              name="status"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-48">
            <select
              id="category"
              name="category"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-auto sm:ml-auto">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Project
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              id="sortBy"
              name="sortBy"
              className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ArrowsUpDownIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                {sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
              </span>
            </button>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ring-1 ring-inset ${
                  viewMode === 'grid' ? 'ring-primary-600' : 'ring-gray-300'
                } focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ring-1 ring-inset ${
                  viewMode === 'table' ? 'ring-primary-600' : 'ring-gray-300'
                } focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProjects.map((project) => (
                <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Project+Image';
                      }}
                    />
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 truncate" title={project.title}>
                        {project.title}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2" title={project.description}>
                      {project.description}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Homeowner</p>
                        <p className="text-sm font-medium text-gray-900 truncate" title={project.homeowner}>
                          {project.homeowner}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Provider</p>
                        <p className="text-sm font-medium text-gray-900 truncate" title={project.provider}>
                          {project.provider}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">Timeline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500 text-right">
                      Last updated: {formatDate(project.lastUpdated)}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flex justify-between">
                      <Link
                        to={`/admin/projects/${project.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Table View */}
          {viewMode === 'table' && (
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Project
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Homeowner
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Provider
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Budget
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Timeline
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Progress
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {sortedProjects.map((project) => (
                          <tr key={project.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                                  <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="h-10 w-10 object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/40?text=Project';
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{project.title}</div>
                                  <div className="text-gray-500">{project.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{project.homeowner}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{project.provider}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {getStatusBadge(project.status)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{formatCurrency(project.budget)}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div>
                                <div className="flex items-center justify-between text-xs">
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary-600 h-2 rounded-full" 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link
                                to={`/admin/projects/${project.id}`}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                View
                              </Link>
                              <button
                                type="button"
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {sortedProjects.length === 0 && (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {projects.length === 0 
                  ? "No projects have been added to the system yet."
                  : "No projects match your current search filters."}
              </p>
              {projects.length === 0 && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Project
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
