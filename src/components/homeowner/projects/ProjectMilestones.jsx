import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectService } from '../../../lib/projects';
import { StripeService } from '../../../lib/integrations';
import { CheckIcon, ClockIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function ProjectMilestones() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);
  
  async function fetchProjectData() {
    try {
      setLoading(true);
      setError(null);
      
      const projectData = await ProjectService.getProjectById(projectId);
      setProject(projectData);
      
      const milestonesData = await ProjectService.getProjectMilestones(projectId);
      setMilestones(milestonesData);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError('Failed to load project data. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  const handlePayMilestone = async (milestone) => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      setSelectedMilestone(milestone);
      
      // Create a payment intent
      const paymentIntent = await ProjectService.createMilestonePayment(milestone.id);
      
      // In a real app, this would redirect to a payment page or open a modal
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the milestone status
      const updatedMilestone = await ProjectService.updateMilestone(milestone.id, {
        status: 'paid',
        payment_id: paymentIntent.id
      });
      
      // Update the milestones list
      setMilestones(milestones.map(m => 
        m.id === updatedMilestone.id ? updatedMilestone : m
      ));
      
      setSelectedMilestone(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentError('Failed to process payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <CheckIcon className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <BanknotesIcon className="h-3 w-3 mr-1" />
            Paid
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return null;
  }
  
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Project Milestones</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Track progress and payments for your project with {project.provider?.business_name || 'your provider'}.
        </p>
      </div>
      
      {paymentError && (
        <div className="mx-4 mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{paymentError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        {milestones.length === 0 ? (
          <div className="py-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your provider hasn't added any milestones to this project yet.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {milestones.map((milestone, milestoneIdx) => (
                <li key={milestone.id}>
                  <div className="relative pb-8">
                    {milestoneIdx !== milestones.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            milestone.status === 'paid'
                              ? 'bg-green-500'
                              : milestone.status === 'completed'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}
                        >
                          {milestone.status === 'paid' ? (
                            <BanknotesIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          ) : milestone.status === 'completed' ? (
                            <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{milestone.name}</p>
                          {milestone.description && (
                            <p className="mt-1 text-sm text-gray-500">{milestone.description}</p>
                          )}
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <BanknotesIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <p>{formatCurrency(milestone.amount)}</p>
                          </div>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm">
                          <div className="mb-2">{getStatusBadge(milestone.status)}</div>
                          <time dateTime={milestone.due_date} className="text-gray-500">
                            Due: {formatDate(milestone.due_date)}
                          </time>
                          
                          {milestone.status === 'completed' && (
                            <div className="mt-2">
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                onClick={() => handlePayMilestone(milestone)}
                                disabled={paymentLoading && selectedMilestone?.id === milestone.id}
                              >
                                {paymentLoading && selectedMilestone?.id === milestone.id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCardIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                    Pay Now
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Financing options section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Financing Options</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Explore financing options to help with your project payments.
        </p>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">0% APR Financing</h4>
                <p className="text-sm text-gray-500">Pay over time with no interest for 12 months</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-inset ring-primary-600 hover:bg-primary-50"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Low-Rate Loan</h4>
                <p className="text-sm text-gray-500">Fixed rates starting at 5.99% APR</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-inset ring-primary-600 hover:bg-primary-50"
              >
                Apply Now
              </button>
            </div>
          </div>
          
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Payment Plans</h4>
                <p className="text-sm text-gray-500">Flexible monthly payments tailored to your budget</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm ring-1 ring-inset ring-primary-600 hover:bg-primary-50"
              >
                See Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
