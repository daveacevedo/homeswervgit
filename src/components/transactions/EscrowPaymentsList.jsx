import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function EscrowPaymentsList({ projectId, role = 'homeowner' }) {
  const [user, setUser] = useState(null);
  const [escrowPayments, setEscrowPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchEscrowPayments(user.id);
      }
    };
    
    getCurrentUser();
  }, [projectId, role]);

  const fetchEscrowPayments = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('escrow_payments')
        .select(`
          *,
          transaction:transaction_id (
            id,
            payer_id,
            recipient_id,
            payment_method,
            transaction_date,
            payer:payer_id (
              id,
              first_name,
              last_name,
              email
            ),
            recipient:recipient_id (
              id,
              business_name,
              contact_name,
              email
            )
          ),
          project:project_id (
            id,
            title
          ),
          milestone:milestone_id (
            id,
            description,
            due_date
          )
        `);
      
      // Filter by project if provided
      if (projectId) {
        query = query.eq('project_id', projectId);
      } else {
        // Filter based on role
        if (role === 'homeowner') {
          query = query.eq('transaction.payer_id', userId);
        } else if (role === 'provider') {
          query = query.eq('transaction.recipient_id', userId);
        }
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setEscrowPayments(data || []);
    } catch (err) {
      console.error('Error fetching escrow payments:', err);
      setError('Failed to load escrow payments');
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    if (!user || !selectedPayment) return;
    
    try {
      setLoading(true);
      
      // Update escrow payment status
      const { error: escrowError } = await supabase
        .from('escrow_payments')
        .update({
          status: 'released',
          release_date: new Date().toISOString()
        })
        .eq('id', selectedPayment.id);
      
      if (escrowError) throw escrowError;
      
      // Refresh the list
      fetchEscrowPayments(user.id);
      setShowReleaseModal(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error('Error releasing escrow payment:', err);
      setError('Failed to release payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'held':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Funds Held
        </span>;
      case 'released':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Released
        </span>;
      case 'refunded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Refunded
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <h3 className="text-sm font-medium text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to view escrow payments.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-3 h-4 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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

  if (escrowPayments.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No escrow payments</h3>
          <p className="mt-1 text-sm text-gray-500">
            {projectId
              ? "There are no escrow payments for this project yet."
              : role === 'homeowner'
                ? "You haven't made any escrow payments yet."
                : "You don't have any escrow payments for your services yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Escrow Payments</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {projectId
              ? "Secure payments for this project"
              : role === 'homeowner'
                ? "Secure payments you've made to service providers"
                : "Secure payments held for your services"}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {escrowPayments.map((payment) => (
              <li key={payment.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {payment.project?.title || 'Unnamed Project'}
                      {payment.milestone && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Milestone: {payment.milestone.description})
                        </span>
                      )}
                    </h4>
                    <div className="mt-1 flex items-center">
                      {getStatusBadge(payment.status)}
                      <span className="ml-2 text-sm text-gray-500">
                        Created on {formatDate(payment.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      via {payment.transaction?.payment_method?.replace('_', ' ').toUpperCase() || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-medium">Release Conditions:</p>
                  <p className="mt-1 text-sm text-gray-900">{payment.release_conditions}</p>
                </div>
                
                {role === 'homeowner' ? (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Provider:</p>
                    <p className="mt-1 text-sm text-gray-900">
                      <Link to={`/homeowner/providers/${payment.transaction?.recipient?.id}`} className="text-primary-600 hover:text-primary-900">
                        {payment.transaction?.recipient?.business_name || 'Unknown Provider'}
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Homeowner:</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {payment.transaction?.payer?.first_name} {payment.transaction?.payer?.last_name}
                    </p>
                  </div>
                )}
                
                {payment.status === 'held' && role === 'homeowner' && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowReleaseModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Release Funds
                    </button>
                  </div>
                )}
                
                {payment.status === 'released' && payment.release_date && (
                  <p className="mt-2 text-xs text-gray-500">
                    Released on {formatDate(payment.release_date)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Release Confirmation Modal */}
      {showReleaseModal && selectedPayment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Release Escrow Payment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to release the payment of {formatCurrency(selectedPayment.amount)} to the service provider? This action cannot be undone.
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        By releasing the funds, you confirm that the following conditions have been met:
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        "{selectedPayment.release_conditions}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReleasePayment}
                >
                  Release Funds
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowReleaseModal(false);
                    setSelectedPayment(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
