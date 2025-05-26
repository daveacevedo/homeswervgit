import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function VerificationManagement() {
  const { hasPermission } = useAdmin();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  
  const canManageVerifications = hasPermission('provider_management', 'manage_verifications');

  useEffect(() => {
    fetchVerifications();
  }, []);

  async function fetchVerifications() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_verifications')
        .select(`
          *,
          provider:provider_id (
            business_name,
            contact_name,
            email,
            phone
          ),
          reviewer:reviewed_by (
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      setError('Failed to load verifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (verification) => {
    if (!canManageVerifications) return;
    
    try {
      const { error } = await supabase
        .from('provider_verifications')
        .update({
          status: 'approved',
          notes: reviewNotes,
          reviewed_by: (await supabase.auth.getUser()).data.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verification.id);
      
      if (error) throw error;
      
      // Update local state
      setVerifications(verifications.map(v => 
        v.id === verification.id 
          ? { 
              ...v, 
              status: 'approved', 
              notes: reviewNotes,
              reviewed_at: new Date().toISOString()
            } 
          : v
      ));
      
      setSelectedVerification(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Failed to approve verification. Please try again.');
    }
  };

  const handleReject = async (verification) => {
    if (!canManageVerifications) return;
    
    try {
      const { error } = await supabase
        .from('provider_verifications')
        .update({
          status: 'rejected',
          notes: reviewNotes,
          reviewed_by: (await supabase.auth.getUser()).data.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verification.id);
      
      if (error) throw error;
      
      // Update local state
      setVerifications(verifications.map(v => 
        v.id === verification.id 
          ? { 
              ...v, 
              status: 'rejected', 
              notes: reviewNotes,
              reviewed_at: new Date().toISOString()
            } 
          : v
      ));
      
      setSelectedVerification(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Failed to reject verification. Please try again.');
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Provider Verification Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve provider verification requests
        </p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
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
      )}
      
      {selectedVerification && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Verification Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review provider verification information
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedVerification.provider?.business_name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedVerification.provider?.contact_name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedVerification.provider?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedVerification.provider?.phone}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Verification Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedVerification.verification_type}</dd>
                </div>
                {selectedVerification.document_url && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Document</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a 
                        href={selectedVerification.document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500"
                      >
                        View Document
                      </a>
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(selectedVerification.status)}`}>
                      {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                    </span>
                  </dd>
                </div>
                {selectedVerification.status !== 'pending' && (
                  <>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Review Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVerification.notes || 'No notes provided'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Reviewed By</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedVerification.reviewer?.email || 'Unknown'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Reviewed At</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedVerification.reviewed_at ? new Date(selectedVerification.reviewed_at).toLocaleString() : 'N/A'}
                      </dd>
                    </div>
                  </>
                )}
                {selectedVerification.status === 'pending' && canManageVerifications && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Review Notes</dt>
                    <dd className="mt-1">
                      <textarea
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="Add notes about this verification..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
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
                  setSelectedVerification(null);
                  setReviewNotes('');
                }}
              >
                Close
              </button>
              
              {selectedVerification.status === 'pending' && canManageVerifications && (
                <>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => handleReject(selectedVerification)}
                  >
                    <XMarkIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Reject
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => handleApprove(selectedVerification)}
                  >
                    <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Provider
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
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
                      <td colSpan={5} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : verifications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                        No verification requests found
                      </td>
                    </tr>
                  ) : (
                    verifications.map((verification) => (
                      <tr key={verification.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {verification.provider?.business_name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {verification.verification_type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(verification.status)}`}>
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-primary-600 hover:text-primary-900"
                            onClick={() => setSelectedVerification(verification)}
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">View {verification.provider?.business_name}</span>
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
