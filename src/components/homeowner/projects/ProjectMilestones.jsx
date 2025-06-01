import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ProjectMilestones = () => {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: 'Project Kickoff',
      description: 'Initial meeting and project planning',
      dueDate: '2023-10-05',
      completedDate: '2023-10-05',
      status: 'completed',
      payment: {
        amount: 1250,
        status: 'paid',
        date: '2023-10-05'
      }
    },
    {
      id: 2,
      title: 'Demo and Prep Work',
      description: 'Removal of existing fixtures and preparation for new installation',
      dueDate: '2023-10-15',
      completedDate: '2023-10-18',
      status: 'completed',
      payment: {
        amount: 2500,
        status: 'paid',
        date: '2023-10-20'
      }
    },
    {
      id: 3,
      title: 'Plumbing and Electrical',
      description: 'Rough-in plumbing and electrical work',
      dueDate: '2023-10-28',
      completedDate: '2023-10-30',
      status: 'completed',
      payment: {
        amount: 3000,
        status: 'paid',
        date: '2023-11-02'
      }
    },
    {
      id: 4,
      title: 'Tile Installation',
      description: 'Installation of floor and wall tile',
      dueDate: '2023-11-15',
      completedDate: null,
      status: 'in_progress',
      payment: {
        amount: 3500,
        status: 'pending',
        date: null
      }
    },
    {
      id: 5,
      title: 'Fixture Installation',
      description: 'Installation of vanity, toilet, shower, and other fixtures',
      dueDate: '2023-11-30',
      completedDate: null,
      status: 'not_started',
      payment: {
        amount: 1700,
        status: 'not_due',
        date: null
      }
    },
    {
      id: 6,
      title: 'Final Inspection and Walkthrough',
      description: 'Final inspection and client walkthrough',
      dueDate: '2023-12-10',
      completedDate: null,
      status: 'not_started',
      payment: {
        amount: 550,
        status: 'not_due',
        date: null
      }
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case 'not_started':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Not Started
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
  
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Pending
          </span>
        );
      case 'not_due':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Not Due
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
  
  const calculateTotalPaid = () => {
    return milestones
      .filter(milestone => milestone.payment.status === 'paid')
      .reduce((sum, milestone) => sum + milestone.payment.amount, 0);
  };
  
  const calculateTotalPending = () => {
    return milestones
      .filter(milestone => milestone.payment.status === 'pending')
      .reduce((sum, milestone) => sum + milestone.payment.amount, 0);
  };
  
  const calculateTotalRemaining = () => {
    return milestones
      .filter(milestone => milestone.payment.status === 'not_due')
      .reduce((sum, milestone) => sum + milestone.payment.amount, 0);
  };
  
  const calculateTotalCost = () => {
    return milestones.reduce((sum, milestone) => sum + milestone.payment.amount, 0);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Project Milestones & Payments</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Track project progress and payment schedule
          </p>
        </div>
        <div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Milestone
          </button>
        </div>
      </div>
      
      {/* Payment Summary */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-50 overflow-hidden rounded-lg shadow-sm px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Project Cost</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(calculateTotalCost())}</dd>
          </div>
          
          <div className="bg-green-50 overflow-hidden rounded-lg shadow-sm px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-green-800 truncate">Paid to Date</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-900">{formatCurrency(calculateTotalPaid())}</dd>
          </div>
          
          <div className="bg-yellow-50 overflow-hidden rounded-lg shadow-sm px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-yellow-800 truncate">Pending Payments</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-900">{formatCurrency(calculateTotalPending())}</dd>
          </div>
          
          <div className="bg-gray-50 overflow-hidden rounded-lg shadow-sm px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Remaining Balance</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(calculateTotalRemaining())}</dd>
          </div>
        </div>
      </div>
      
      {/* Milestones Table */}
      <div className="border-t border-gray-200">
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Milestone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {milestones.map((milestone) => (
                <tr key={milestone.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                    <div className="text-sm text-gray-500">{milestone.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(milestone.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(milestone.status)}
                    {milestone.status === 'completed' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed: {formatDate(milestone.completedDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(milestone.payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(milestone.payment.status)}
                    {milestone.payment.status === 'paid' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Paid on: {formatDate(milestone.payment.date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {milestone.status === 'completed' ? 'View Details' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Payment Schedule */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Schedule</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Upcoming payments for this project
        </p>
        
        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {milestones
              .filter(milestone => milestone.payment.status !== 'paid')
              .map((milestone) => (
                <li key={milestone.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(milestone.payment.amount)}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-shrink-0">
                        {getPaymentStatusBadge(milestone.payment.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          Due: {formatDate(milestone.dueDate)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {milestone.payment.status === 'pending' ? (
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Make Payment
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              
            {milestones.filter(milestone => milestone.payment.status !== 'paid').length === 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6 text-center">
                  <p className="text-sm text-gray-500">All payments have been completed.</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestones;
