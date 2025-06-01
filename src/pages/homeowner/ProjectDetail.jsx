import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import ProjectMilestones from '../../components/homeowner/projects/ProjectMilestones';
import { 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  UserIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [coordinator, setCoordinator] = useState(null);
  
  useEffect(() => {
    if (user) {
      fetchProjectData();
    } else {
      setLoading(false);
    }
  }, [id, user]);
  
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (projectError) throw projectError;
      
      // If no data, use mock data
      const mockProject = {
        id: 'proj-1',
        title: 'Bathroom Renovation',
        description: 'Complete renovation of master bathroom including new fixtures, tile, and vanity',
        status: 'in_progress',
        provider: {
          id: 'prov-1',
          name: 'Ace Plumbing & Remodeling',
          rating: 4.8,
          contact: {
            email: 'info@aceplumbing.com',
            phone: '(555) 123-4567'
          }
        },
        startDate: '2023-10-01',
        estimatedEndDate: '2023-12-15',
        progress: 65,
        budget: 12500,
        nextMilestone: 'Tile Installation',
        nextMilestoneDate: '2023-11-15',
        location: 'Master Bathroom',
        priority: 'high',
        lastUpdated: '2023-11-02T14:30:00',
        notes: 'We want to create a modern, spa-like bathroom with a walk-in shower, freestanding tub, and double vanity. The color scheme should be neutral with accents of blue and gray.'
      };
      
      const projectToUse = projectData || mockProject;
      setProject(projectToUse);
      
      // Fetch coordinator if any
      const { data: coordinatorData, error: coordinatorError } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', id)
        .eq('role', 'coordinator')
        .single();
        
      if (!coordinatorError) {
        setCoordinator(coordinatorData);
      }
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true });
        
      if (!tasksError) {
        setTasks(tasksData || []);
      } else {
        // Mock tasks if needed
        setTasks([
          {
            id: 'task-1',
            title: 'Demo existing bathroom',
            description: 'Remove all fixtures, tile, and drywall',
            assignee: 'provider',
            start_date: '2023-10-01',
            end_date: '2023-10-07',
            cost: 1500,
            status: 'completed'
          },
          {
            id: 'task-2',
            title: 'Plumbing rough-in',
            description: 'Install new plumbing lines for shower, tub, and vanity',
            assignee: 'provider',
            start_date: '2023-10-08',
            end_date: '2023-10-14',
            cost: 2800,
            status: 'completed'
          },
          {
            id: 'task-3',
            title: 'Electrical work',
            description: 'Install new lighting, outlets, and exhaust fan',
            assignee: 'provider',
            start_date: '2023-10-15',
            end_date: '2023-10-21',
            cost: 1800,
            status: 'completed'
          },
          {
            id: 'task-4',
            title: 'Drywall and cement board',
            description: 'Install new drywall and cement board for tile',
            assignee: 'provider',
            start_date: '2023-10-22',
            end_date: '2023-10-28',
            cost: 1200,
            status: 'completed'
          },
          {
            id: 'task-5',
            title: 'Tile installation',
            description: 'Install floor and shower tile',
            assignee: 'provider',
            start_date: '2023-11-01',
            end_date: '2023-11-14',
            cost: 3500,
            status: 'in_progress'
          },
          {
            id: 'task-6',
            title: 'Install fixtures',
            description: 'Install vanity, toilet, tub, and shower fixtures',
            assignee: 'provider',
            start_date: '2023-11-15',
            end_date: '2023-11-30',
            cost: 1700,
            status: 'not_started'
          }
        ]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError('Failed to load project data. Please try again.');
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'planning':
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Planning
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Scheduled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            In Progress
          </span>
        );
      case 'on_hold':
        return (
          <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-0.5 text-sm font-medium text-orange-800">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            On Hold
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const getTaskStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            In Progress
          </span>
        );
      case 'not_started':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Not Started
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Blocked
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
          <span className="inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
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
  
  const calculateTasksTotal = () => {
    return tasks.reduce((sum, task) => sum + (Number(task.cost) || 0), 0);
  };
  
  const calculateCompletedTasksTotal = () => {
    return tasks
      .filter(task => task.status === 'completed')
      .reduce((sum, task) => sum + (Number(task.cost) || 0), 0);
  };
  
  const calculateProgress = () => {
    if (tasks.length === 0) return project?.progress || 0;
    
    const completedCost = calculateCompletedTasksTotal();
    const totalCost = calculateTasksTotal();
    
    return totalCost > 0 ? Math.round((completedCost / totalCost) * 100) : 0;
  };
  
  const exportTasksToCSV = () => {
    // Create CSV content
    const headers = [
      'Title',
      'Description',
      'Assignee',
      'Start Date',
      'End Date',
      'Cost',
      'Status'
    ];
    
    const rows = tasks.map(task => [
      task.title,
      task.description,
      task.assignee,
      task.start_date,
      task.end_date,
      task.cost,
      task.status
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `project-tasks-${id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => navigate('/homeowner/projects')}
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Back to Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <div className="mt-6">
            <Link
              to="/homeowner/projects"
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {project.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {project.location}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              Started: {formatDate(project.startDate)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              Budget: {formatCurrency(project.budget)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              Provider: {project.provider ? project.provider.name : 'None assigned'}
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <span className="shadow-sm rounded-md mr-2">
            {getStatusBadge(project.status)}
          </span>
          <span className="shadow-sm rounded-md">
            {getPriorityBadge(project.priority)}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      {project.status === 'in_progress' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Progress</h3>
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">
                  {calculateProgress()}% Complete
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Estimated completion: {formatDate(project.estimatedEndDate)}
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`${
              activeTab === 'tasks'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`${
              activeTab === 'milestones'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Milestones & Payments
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`${
              activeTab === 'messages'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Messages
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Project Details */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Project Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Key information about your project
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.description}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {getStatusBadge(project.status)}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.location}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Budget</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(project.budget)}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(project.startDate)}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Estimated End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(project.estimatedEndDate)}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {getPriorityBadge(project.priority)}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.notes || 'No additional notes'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(project.lastUpdated).toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            {/* Service Provider */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Service Provider</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Contact information for your service provider
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                {project.provider ? (
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.provider.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Rating</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span>{project.provider.rating} / 5</span>
                        </div>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`mailto:${project.provider.contact?.email}`} className="text-primary-600 hover:text-primary-900">
                          {project.provider.contact?.email}
                        </a>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`tel:${project.provider.contact?.phone}`} className="text-primary-600 hover:text-primary-900">
                          {project.provider.contact?.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="py-4 px-6 text-center">
                    <p className="text-sm text-gray-500">No service provider assigned yet.</p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Find a Provider
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Project Coordinator */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Project Coordinator</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Contact information for your project coordinator
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                {coordinator ? (
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{coordinator.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`mailto:${coordinator.email}`} className="text-primary-600 hover:text-primary-900">
                          {coordinator.email}
                        </a>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a href={`tel:${coordinator.phone}`} className="text-primary-600 hover:text-primary-900">
                          {coordinator.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          coordinator.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {coordinator.status === 'active' ? 'Active' : 'Invited'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="py-4 px-6 text-center">
                    <p className="text-sm text-gray-500">No coordinator assigned to this project.</p>
                    <Link
                      to={`/homeowner/projects/${id}/edit`}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Add Coordinator
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Project Tasks</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track and manage all tasks for this project
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={exportTasksToCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {tasks.length === 0 ? (
              <div className="py-10 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first task.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/homeowner/projects/${id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Task
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.assignee === 'owner' ? 'You (Homeowner)' : 
                           task.assignee === 'coordinator' ? 'Coordinator' : 
                           task.assignee === 'provider' ? 'Service Provider' : 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Start: {formatDate(task.start_date)}</div>
                          <div>End: {formatDate(task.end_date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(task.cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTaskStatusBadge(task.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total row */}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(calculateTasksTotal())}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'milestones' && (
        <ProjectMilestones />
      )}
      
      {activeTab === 'documents' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Project Documents</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Access and manage all documents related to this project
              </p>
            </div>
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Upload Document
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="py-10 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first document.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Project Messages</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Communicate with your service provider and coordinator
              </p>
            </div>
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ChatBubbleLeftRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Message
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="py-10 text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start a conversation with your service provider or coordinator.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ChatBubbleLeftRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
