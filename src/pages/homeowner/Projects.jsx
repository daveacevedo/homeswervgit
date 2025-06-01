import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { 
  WrenchScrewdriverIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Projects = () => {
  const { homeownerProfile } = useHomeowner();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // Simulate fetching data
    const fetchProjects = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProjects = [
          {
            id: 'proj-1',
            title: 'Bathroom Renovation',
            description: 'Complete renovation of master bathroom including new fixtures, tile, and vanity',
            status: 'in_progress',
            provider: {
              id: 'prov-1',
              name: 'Ace Plumbing & Remodeling',
              rating: 4.8
            },
            startDate: '2023-10-01',
            estimatedEndDate: '2023-12-15',
            progress: 65,
            budget: 12500,
            nextMilestone: 'Tile Installation',
            nextMilestoneDate: '2023-11-15',
            location: 'Master Bathroom',
            priority: 'high',
            lastUpdated: '2023-11-02T14:30:00'
          },
          {
            id: 'proj-2',
            title: 'Lawn Maintenance',
            description: 'Bi-weekly lawn maintenance including mowing, edging, and cleanup',
            status: 'scheduled',
            provider: {
              id: 'prov-2',
              name: 'Green Thumb Landscaping',
              rating: 4.6
            },
            startDate: '2023-11-10',
            estimatedEndDate: '2024-11-10',
            progress: 0,
            budget: 2400,
            nextMilestone: 'Initial Service',
            nextMilestoneDate: '2023-11-10',
            location: 'Front and Back Yard',
            priority: 'medium',
            lastUpdated: '2023-10-28T09:15:00'
          },
          {
            id: 'proj-3',
            title: 'Electrical Panel Upgrade',
            description: 'Upgrade electrical panel from 100A to 200A service',
            status: 'completed',
            provider: {
              id: 'prov-3',
              name: 'Bright Spark Electric',
              rating: 4.9
            },
            startDate: '2023-10-15',
            completedDate: '2023-10-28',
            progress: 100,
            budget: 2800,
            location: 'Garage',
            priority: 'high',
            lastUpdated: '2023-10-28T16:45:00'
          },
          {
            id: 'proj-4',
            title: 'Kitchen Remodel',
            description: 'Complete kitchen renovation with new cabinets, countertops, and appliances',
            status: 'planning',
            provider: null,
            estimatedStartDate: '2024-01-15',
            estimatedEndDate: '2024-03-15',
            progress: 0,
            estimatedBudget: 25000,
            location: 'Kitchen',
            priority: 'medium',
            lastUpdated: '2023-10-20T11:30:00'
          },
          {
            id: 'proj-5',
            title: 'Roof Repair',
            description: 'Repair damaged shingles and fix leak in northwest corner of roof',
            status: 'on_hold',
            provider: {
              id: 'prov-4',
              name: 'Top Notch Roofing',
              rating: 4.7
            },
            startDate: '2023-09-15',
            progress: 25,
            budget: 3200,
            location: 'Roof',
            priority: 'high',
            holdReason: 'Weather conditions',
            lastUpdated: '2023-10-05T10:20:00'
          }
        ];
        
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    // Filter projects based on search term and status filter
    const filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.provider && project.provider.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'planning':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Planning
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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Your Projects
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your home improvement projects
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              to="/homeowner/projects/new"
              className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Project
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search projects
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
                    placeholder="Search projects by title, description, location, or provider"
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
                    <option value="planning">Planning</option>
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
        
        {/* Projects List */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center">
              <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {projects.length === 0 
                  ? "You haven't created any projects yet."
                  : "No projects match your current filters."}
              </p>
              {projects.length === 0 && (
                <div className="mt-6">
                  <Link
                    to="/homeowner/projects/new"
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li key={project.id}>
                  <Link to={`/homeowner/projects/${project.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <WrenchScrewdriverIcon className="h-8 w-8 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {getStatusBadge(project.status)}
                          <div className="mt-2">
                            {getPriorityBadge(project.priority)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                            </svg>
                            {project.location}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                            </svg>
                            {project.status === 'completed'
                              ? `Completed on ${formatDate(project.completedDate)}`
                              : project.status === 'planning'
                                ? `Planned start: ${formatDate(project.estimatedStartDate)}`
                                : `Started: ${formatDate(project.startDate)}`}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 001.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A.75.75 0 008.798 7.45zM5.904 10.5c.37.33.84.5 1.346.5.37 0 .733-.09 1.05-.26a.75.75 0 01.707 1.32A3.3 3.3 0 017.25 12.5c-.834 0-1.571-.296-2.096-.79a.75.75 0 01.75-1.21zM10 13a1 1 0 100-2 1 1 0 000 2zm4.25-1.5c.37 0 .733-.09 1.05-.26a.75.75 0 01.707 1.32 3.3 3.3 0 01-1.757.44c-.834 0-1.571-.296-2.096-.79a.75.75 0 11.75-1.21c.37.33.84.5 1.346.5z" clipRule="evenodd" />
                          </svg>
                          {project.provider
                            ? `${project.provider.name} (${project.provider.rating}★)`
                            : 'No provider assigned'}
                        </div>
                      </div>
                      
                      {project.status === 'in_progress' && (
                        <div className="mt-4">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  Progress: {project.progress}%
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {formatCurrency(project.budget)}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                              <div
                                style={{ width: `${project.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Next milestone:</span> {project.nextMilestone} (Due: {formatDate(project.nextMilestoneDate)})
                          </p>
                        </div>
                      )}
                      
                      {project.status === 'on_hold' && (
                        <div className="mt-2">
                          <p className="text-sm text-orange-600">
                            <ExclamationTriangleIcon className="inline h-4 w-4 mr-1" />
                            On hold: {project.holdReason}
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500 text-right">
                        Last updated: {new Date(project.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* FoxyApps Embed Section */}
      <div className="lg:w-[400px] bg-white shadow sm:rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Project Planning Tool</h3>
          <p className="mt-1 text-sm text-gray-500">
            Use this interactive tool to help plan and visualize your home improvement projects.
          </p>
        </div>
        <div className="flex justify-center">
          <iframe 
            src="https://www.foxyapps.com/embed/403fd05c-a052-4666-a3e7-37739866506c"
            width="400" 
            height="730"
            style={{ borderRadius: '0.5rem', border: 'none' }} 
            loading="lazy"
            referrerPolicy="unsafe-url" 
            allow="clipboard-read; clipboard-write"
            title="Project Planning Tool"
            className="shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Projects;
