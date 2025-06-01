import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProvider } from '../../contexts/ProviderContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  ArrowLeftIcon,
  BriefcaseIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  PhotoIcon,
  PaperClipIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { providerProfile } = useProvider();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [updateStatus, setUpdateStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: '',
    amount: ''
  });
  
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);
  
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      
      // If no data, use mock data
      if (!data) {
        // Mock job data
        const mockJob = {
          id: 'job-1',
          title: 'Bathroom Renovation',
          description: 'Complete renovation of master bathroom including new fixtures, tile, and vanity',
          status: 'in_progress',
          client: {
            id: 'client-1',
            name: 'Sarah Johnson',
            address: '123 Main St, Anytown, CA',
            phone: '(555) 123-4567',
            email: 'sarah.johnson@example.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          property: {
            id: 'prop-1',
            name: 'Main Residence',
            address: '123 Main St, Anytown, CA',
            type: 'Single Family Home',
            yearBuilt: 1998,
            squareFeet: 2400,
            image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          },
          startDate: '2023-10-01',
          estimatedEndDate: '2023-12-15',
          progress: 65,
          budget: 12500,
          amountPaid: 8125,
          amountDue: 4375,
          priority: 'high',
          lastUpdated: '2023-11-02T14:30:00',
          milestones: [
            {
              id: 'ms-1',
              title: 'Demo and Prep',
              description: 'Remove old fixtures, tile, and prepare surfaces',
              status: 'completed',
              dueDate: '2023-10-15',
              completedDate: '2023-10-14',
              amount: 2500,
              paid: true
            },
            {
              id: 'ms-2',
              title: 'Plumbing Rough-In',
              description: 'Install new plumbing lines and fixtures',
              status: 'completed',
              dueDate: '2023-10-30',
              completedDate: '2023-11-01',
              amount: 3500,
              paid: true
            },
            {
              id: 'ms-3',
              title: 'Tile Installation',
              description: 'Install floor and wall tile',
              status: 'in_progress',
              dueDate: '2023-11-15',
              amount: 2800,
              paid: false
            },
            {
              id: 'ms-4',
              title: 'Vanity and Fixtures',
              description: 'Install vanity, toilet, and other fixtures',
              status: 'pending',
              dueDate: '2023-11-30',
              amount: 2200,
              paid: false
            },
            {
              id: 'ms-5',
              title: 'Final Touches',
              description: 'Paint, trim, and final cleanup',
              status: 'pending',
              dueDate: '2023-12-10',
              amount: 1500,
              paid: false
            }
          ],
          materials: [
            {
              id: 'mat-1',
              name: 'Porcelain Floor Tile',
              description: '12"x24" Carrara White',
              quantity: '120 sq ft',
              cost: 1200,
              status: 'delivered'
            },
            {
              id: 'mat-2',
              name: 'Subway Wall Tile',
              description: '3"x6" White Ceramic',
              quantity: '80 sq ft',
              cost: 640,
              status: 'delivered'
            },
            {
              id: 'mat-3',
              name: 'Vanity Cabinet',
              description: '48" Double Sink, White Shaker',
              quantity: '1',
              cost: 1200,
              status: 'ordered'
            },
            {
              id: 'mat-4',
              name: 'Quartz Countertop',
              description: 'White with Gray Veining',
              quantity: '15 sq ft',
              cost: 1350,
              status: 'pending'
            },
            {
              id: 'mat-5',
              name: 'Shower Fixtures',
              description: 'Chrome Finish, Rainfall Head',
              quantity: '1 set',
              cost: 450,
              status: 'delivered'
            }
          ],
          timeline: [
            {
              id: 'tl-1',
              date: '2023-09-15',
              title: 'Job Created',
              description: 'Initial consultation and estimate provided',
              type: 'creation'
            },
            {
              id: 'tl-2',
              date: '2023-09-28',
              title: 'Contract Signed',
              description: 'Client approved proposal and signed contract',
              type: 'contract'
            },
            {
              id: 'tl-3',
              date: '2023-10-01',
              title: 'Work Started',
              description: 'Demolition phase began',
              type: 'milestone'
            },
            {
              id: 'tl-4',
              date: '2023-10-14',
              title: 'Milestone Completed',
              description: 'Demo and Prep phase completed',
              type: 'milestone'
            },
            {
              id: 'tl-5',
              date: '2023-10-20',
              title: 'Payment Received',
              description: 'Payment of $2,500 received for Demo and Prep',
              type: 'payment'
            },
            {
              id: 'tl-6',
              date: '2023-11-01',
              title: 'Milestone Completed',
              description: 'Plumbing Rough-In completed',
              type: 'milestone'
            },
            {
              id: 'tl-7',
              date: '2023-11-02',
              title: 'Payment Received',
              description: 'Payment of $3,500 received for Plumbing Rough-In',
              type: 'payment'
            },
            {
              id: 'tl-8',
              date: '2023-11-03',
              title: 'Milestone Started',
              description: 'Tile Installation phase began',
              type: 'milestone'
            }
          ],
          notes: [
            {
              id: 'note-1',
              date: '2023-10-05',
              author: 'John Smith',
              content: 'Client requested to use a different tile for the shower niche. Adjusted materials list accordingly.'
            },
            {
              id: 'note-2',
              date: '2023-10-18',
              author: 'John Smith',
              content: 'Found water damage behind the old shower. Informed client and added additional waterproofing to prevent future issues.'
            },
            {
              id: 'note-3',
              date: '2023-10-25',
              author: 'Sarah Johnson',
              content: 'Very happy with the progress so far. The team has been professional and clean.'
            }
          ],
          attachments: [
            {
              id: 'att-1',
              name: 'Contract.pdf',
              type: 'document',
              size: '1.2 MB',
              uploadDate: '2023-09-28'
            },
            {
              id: 'att-2',
              name: 'Bathroom_Design.jpg',
              type: 'image',
              size: '3.5 MB',
              uploadDate: '2023-09-20'
            },
            {
              id: 'att-3',
              name: 'Material_Specs.pdf',
              type: 'document',
              size: '0.8 MB',
              uploadDate: '2023-09-25'
            },
            {
              id: 'att-4',
              name: 'Progress_Week1.jpg',
              type: 'image',
              size: '2.1 MB',
              uploadDate: '2023-10-08'
            },
            {
              id: 'att-5',
              name: 'Progress_Week2.jpg',
              type: 'image',
              size: '2.3 MB',
              uploadDate: '2023-10-15'
            }
          ]
        };
        
        setJob(mockJob);
      } else {
        setJob(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
      setLoading(false);
    }
  };
  
  const updateJobStatus = async () => {
    try {
      setUpdateStatus('loading');
      
      // In a real app, this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setJob(prev => ({
        ...prev,
        status: newStatus,
        timeline: [
          ...prev.timeline,
          {
            id: `tl-${prev.timeline.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            title: `Status Changed to ${getStatusLabel(newStatus)}`,
            description: statusNote || `Job status updated to ${getStatusLabel(newStatus)}`,
            type: 'status'
          }
        ]
      }));
      
      setUpdateStatus('success');
      setShowStatusModal(false);
      
      // Reset form
      setNewStatus('');
      setStatusNote('');
      
      // Show success message briefly
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating job status:', error);
      setUpdateStatus('error');
    }
  };
  
  const addMilestone = async () => {
    try {
      setUpdateStatus('loading');
      
      // In a real app, this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const newMilestoneObj = {
        id: `ms-${job.milestones.length + 1}`,
        title: newMilestone.title,
        description: newMilestone.description,
        status: 'pending',
        dueDate: newMilestone.dueDate,
        amount: parseFloat(newMilestone.amount),
        paid: false
      };
      
      setJob(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestoneObj],
        timeline: [
          ...prev.timeline,
          {
            id: `tl-${prev.timeline.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Milestone Added',
            description: `New milestone "${newMilestone.title}" added to the job`,
            type: 'milestone'
          }
        ]
      }));
      
      setUpdateStatus('success');
      setShowAddMilestoneModal(false);
      
      // Reset form
      setNewMilestone({
        title: '',
        description: '',
        dueDate: '',
        amount: ''
      });
      
      // Show success message briefly
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding milestone:', error);
      setUpdateStatus('error');
    }
  };
  
  const updateMilestoneStatus = async (milestoneId, newStatus) => {
    try {
      setUpdateStatus('loading');
      
      // In a real app, this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setJob(prev => {
        const updatedMilestones = prev.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return {
              ...milestone,
              status: newStatus,
              completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
            };
          }
          return milestone;
        });
        
        // Calculate new progress
        const completedMilestones = updatedMilestones.filter(m => m.status === 'completed').length;
        const totalMilestones = updatedMilestones.length;
        const newProgress = Math.round((completedMilestones / totalMilestones) * 100);
        
        // Add to timeline if completed
        let updatedTimeline = [...prev.timeline];
        if (newStatus === 'completed') {
          const milestone = prev.milestones.find(m => m.id === milestoneId);
          updatedTimeline.push({
            id: `tl-${prev.timeline.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Milestone Completed',
            description: `"${milestone.title}" milestone completed`,
            type: 'milestone'
          });
        }
        
        return {
          ...prev,
          milestones: updatedMilestones,
          progress: newProgress,
          timeline: updatedTimeline
        };
      });
      
      setUpdateStatus('success');
      
      // Show success message briefly
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating milestone status:', error);
      setUpdateStatus('error');
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
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
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
            <XMarkIcon className="h-4 w-4 mr-1" />
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
  
  const getMilestoneStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Pending
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckIcon className="h-3 w-3 mr-1" />
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
  
  const getMaterialStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Pending
          </span>
        );
      case 'ordered':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Ordered
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Delivered
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
  
  const getTimelineIcon = (type) => {
    switch (type) {
      case 'creation':
        return <BriefcaseIcon className="h-5 w-5 text-gray-400" />;
      case 'contract':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-600" />;
      case 'status':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <BriefcaseIcon className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getAttachmentIcon = (type) => {
    switch (type) {
      case 'document':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <PhotoIcon className="h-5 w-5 text-green-500" />;
      default:
        return <PaperClipIcon className="h-5 w-5 text-gray-400" />;
    }
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
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="bg-white shadow sm:rounded-lg py-12 text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Job not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The job you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="mt-6">
          <Link
            to="/provider/jobs"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowLeftIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/provider/jobs')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Jobs
        </button>
      </div>
      
      {/* Status update notification */}
      {updateStatus === 'success' && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Job updated successfully.</p>
            </div>
          </div>
        </div>
      )}
      
      {updateStatus === 'error' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to update job. Please try again.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Job Header */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900 flex items-center">
                {job.title}
                <span className="ml-3">{getStatusBadge(job.status)}</span>
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowStatusModal(true)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Update Status
              </button>
              <Link
                to={`/provider/jobs/${jobId}/edit`}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <PencilSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Edit Job
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <img
                  src={job.client.avatar}
                  alt={job.client.name}
                  className="h-8 w-8 rounded-full mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40?text=Client';
                  }}
                />
                {job.client.name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Budget</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(job.budget)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(job.startDate)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Estimated Completion</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(job.estimatedEndDate)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.client.address}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Progress</dt>
              <dd className="mt-1">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {job.progress}% Complete
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {formatCurrency(job.amountPaid)} of {formatCurrency(job.budget)} paid
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
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['details', 'milestones', 'materials', 'timeline', 'notes', 'attachments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Client Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
                <div className="flex items-start">
                  <img
                    src={job.client.avatar}
                    alt={job.client.name}
                    className="h-16 w-16 rounded-full mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=Client';
                    }}
                  />
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{job.client.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {job.client.address}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {job.client.phone}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {job.client.email}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <ChatBubbleLeftRightIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Message Client
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Property Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Information</h3>
                <div className="flex items-start">
                  <img
                    src={job.property.image}
                    alt={job.property.name}
                    className="h-16 w-16 object-cover rounded-md mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=Property';
                    }}
                  />
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{job.property.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {job.property.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Type:</span> {job.property.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Year Built:</span> {job.property.yearBuilt}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Size:</span> {job.property.squareFeet} sq ft
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Financial Summary */}
              <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(job.budget)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="text-2xl font-semibold text-green-600">{formatCurrency(job.amountPaid)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Amount Due</p>
                    <p className="text-2xl font-semibold text-red-600">{formatCurrency(job.amountDue)}</p>
                  </div>
                </div>
              </div>
              
              {/* Job Description */}
              <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-700">{job.description}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
              <button
                type="button"
                onClick={() => setShowAddMilestoneModal(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Milestone
              </button>
            </div>
            
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Milestone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {job.milestones.map((milestone) => (
                    <tr key={milestone.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{milestone.title}</div>
                        <div className="text-gray-500">{milestone.description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(milestone.dueDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatCurrency(milestone.amount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getMilestoneStatusBadge(milestone.status)}
                        {milestone.completedDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Completed: {formatDate(milestone.completedDate)}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {milestone.paid ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {milestone.status === 'pending' && (
                          <button
                            onClick={() => updateMilestoneStatus(milestone.id, 'in_progress')}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Start
                          </button>
                        )}
                        {milestone.status === 'in_progress' && (
                          <button
                            onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Complete
                          </button>
                        )}
                        <Link
                          to={`/provider/jobs/${jobId}/milestones/${milestone.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Materials</h3>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Material
              </button>
            </div>
            
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Material</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {job.materials.map((material) => (
                    <tr key={material.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{material.name}</div>
                        <div className="text-gray-500">{material.description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {material.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatCurrency(material.cost)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getMaterialStatusBadge(material.status)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Job Timeline</h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {job.timeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== job.timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                            {getTimelineIcon(event.type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {event.title}{' '}
                            </p>
                            <p className="text-sm text-gray-700 mt-0.5">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(event.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Note
              </button>
            </div>
            
            <div className="space-y-4">
              {job.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-900">{note.author}</div>
                    <div className="text-sm text-gray-500">{formatDate(note.date)}</div>
                  </div>
                  <p className="mt-2 text-gray-700">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Upload File
              </button>
            </div>
            
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {job.attachments.map((attachment) => (
                <li key={attachment.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="w-full flex items-center justify-between p-4">
                    <div className="flex-1 flex items-center truncate">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                        {getAttachmentIcon(attachment.type)}
                      </div>
                      <div className="flex-1 px-4 py-2 truncate">
                        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-900 truncate">
                          {attachment.name}
                        </a>
                        <p className="text-sm text-gray-500 truncate">
                          {attachment.size} • {formatDate(attachment.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Download file</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Update Job Status</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Select the new status for this job. This will be visible to the client.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select a status</option>
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Add a note about this status change"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={updateJobStatus}
                    disabled={!newStatus || updateStatus === 'loading'}
                    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm ${
                      !newStatus || updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateStatus === 'loading' ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Milestone</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Add a new milestone to track progress and payments for this job.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Milestone title"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Describe what this milestone involves"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone({...newMilestone, amount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddMilestoneModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addMilestone}
                    disabled={!newMilestone.title || !newMilestone.dueDate || !newMilestone.amount || updateStatus === 'loading'}
                    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm ${
                      !newMilestone.title || !newMilestone.dueDate || !newMilestone.amount || updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateStatus === 'loading' ? 'Adding...' : 'Add Milestone'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
