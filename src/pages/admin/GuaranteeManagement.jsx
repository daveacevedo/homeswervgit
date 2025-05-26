import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function GuaranteeManagement() {
  const { hasPermission } = useAdmin();
  const [guarantees, setGuarantees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuarantee, setSelectedGuarantee] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, resolved, all
  
  const canManageGuarantees = hasPermission('customer_support', 'manage_guarantees');

  useEffect(() => {
    fetchGuarantees();
  }, [filter]);

  async function fetchGuarantees() {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('guarantees')
        .select(`
          *,
          homeowner:homeowner_id (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          provider:provider_id (
            id,
            business_name,
            contact_name,
            email,
            phone
          ),
          project:project_id (
            id,
            title,
            description
          )
        `);
      
      // Apply filter
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setGuarantees(data || []);
    } catch (error) {
      console.error('Error fetching guarantees:', error);
      setError('Failed to load guarantees. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async () => {
    if (!canManageGuarantees || !selectedGuarantee) return;
    
    try {
      const { error } = await supabase
        .from('guarantees')
        .update({
          status: 'approved',
          resolution_notes: resolutionNotes,
          resolution_date: new Date().toISOString()
        })
        .eq('id', selectedGuarantee.id);
      
      if (error) throw error;
      
      // Update local state
      setGuarantees(guarantees.map(g => 
        g.id === selectedGuarantee.id 
          ? { 
              ...g, 
              status: 'approved', 
              resolution_notes: resolutionNotes,
              resolution_date: new Date().toISOString()
            } 
          : g
      ));
      
      setSelectedGuarantee(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error approving guarantee:', error);
      alert('Failed to approve guarantee. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!canManageGuarantees || !selectedGuarantee) return;
    
    try {
      const { error } = await supabase
        .from('guarantees')
        .update({
          status: 'rejected',
          resolution_notes: resolutionNotes,
          resolution_date: new Date().toISOString()
        })
        .eq('id', selectedGuarantee.id);
      
      if (error) throw error;
      
      // Update local state
      setGuarantees(guarantees.map(g => 
        g.id === selectedGuarantee.id 
          ? { 
              ...g, 
              status: 'rejected', 
              resolution_notes: resolutionNotes,
              resolution_date: new Date().toISOString()
            } 
          : g
      ));
      
      setSelectedGuarantee(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error rejecting guarantee:', error);
      alert('Failed to reject guarantee. Please try again.');
    }
  };

  const handleResolve = async () => {
    if (!canManageGuarantees || !selectedGuarantee) return;
    
    try {
      const { error } = await supabase
        .from('guarantees')
        .update({
          status: 'resolved',
          resolution_notes: resolutionNotes,
          resolution_date: new Date().toISOString()
        })
        .eq('id', selectedGuarantee.id);
      
      if (error) throw error;
      
      // Update local state
      setGuarantees(guarantees.map(g => 
        g.id === selectedGuarantee.id 
          ? { 
              ...g, 
              status: 'resolved', 
              resolution_notes: resolutionNotes,
              resolution_date: new Date().toISOString()
            } 
          : g
      ));
      
      setSelectedGuarantee(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error resolving guarantee:', error);
      alert('Failed to resolve guarantee. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Guarantee Claims Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and process satisfaction guarantee claims
        </p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedGuarantee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Guarantee Claim Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review and process the guarantee claim
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Project</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedGuarantee.project?.title}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Homeowner</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedGuarantee.homeowner?.first_name} {selectedGuarantee.homeowner?.last_name}
                    <div className="text-xs text-gray-500">
                      {selectedGuarantee.homeowner?.email}<br />
                      {selectedGuarantee.homeowner?.phone}
                    </div>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedGuarantee.provider?.business_name}
                    <div className="text-xs text-gray-500">
                      {selectedGuarantee.provider?.contact_name}<br />
                      {selectedGuarantee.provider?.email}<br />
                      {selectedGuarantee.provider?.phone}
                    </div>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Claim Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatCurrency(selectedGuarantee.claim_amount)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(selectedGuarantee.status)}`}>
                      {selectedGuarantee.status.charAt(0).toUpperCase() + selectedGuarantee.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Claim Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedGuarantee.claim_reason}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Project Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedGuarantee.project?.description}</dd>
                </div>
                {selectedGuarantee.status !== 'pending' && (
                  <>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Resolution Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedGuarantee.resolution_notes || 'No notes provided'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Resolution Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedGuarantee.resolution_date)}
                      </dd>
                    </div>
                  </>
                )}
                {selectedGuarantee.status === 'pending' && canManageGuarantees && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Resolution Notes</dt>
                    <dd className="mt-1">
                      <textarea
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="Add notes about the resolution of this claim..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                      />
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => {
                  setSelectedGuarantee(null);
                  setResolutionNotes('');
                }}
              >
                Close
              </button>
              
              {selectedGuarantee.status === 'pending' && canManageGuarantees && (
                <>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={handleReject}
                  >
                    <XCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Reject Claim
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={handleApprove}
                  >
                    <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Approve Claim
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleResolve}
                  >
                    Resolve Claim
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4 flex justify-end">
        <select
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="pending">Pending Claims</option>
          <option value="approved">Approved Claims</option>
          <option value="rejected">Rejected Claims</option>
          <option value="resolved">Resolved Claims</option>
          <option value="all">All Claims</option>
        </select>
      </div>
      
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
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Submitted
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : guarantees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                        No guarantee claims found
                      </td>
                    </tr>
                  ) : (
                    guarantees.map((guarantee) => (
                      <tr key={guarantee.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {guarantee.project?.title || 'Unknown Project'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {guarantee.homeowner?.first_name} {guarantee.homeowner?.last_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {guarantee.provider?.business_name || 'Unknown Provider'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(guarantee.claim_amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(guarantee.status)}`}>
                            {guarantee.status.charAt(0).toUpperCase() + guarantee.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(guarantee.created_at)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-primary-600 hover:text-primary-900"
                            onClick={() => setSelectedGuarantee(guarantee)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
