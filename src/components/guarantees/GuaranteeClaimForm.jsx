import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function GuaranteeClaimForm({ projectId, providerId, onSuccess }) {
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getCurrentUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit a guarantee claim');
      return;
    }
    
    if (!reason.trim()) {
      setError('Please provide a reason for your claim');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid claim amount');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('guarantees')
        .insert({
          project_id: projectId,
          homeowner_id: user.id,
          provider_id: providerId,
          claim_reason: reason.trim(),
          claim_amount: parseFloat(amount),
          status: 'pending'
        });
      
      if (error) throw error;
      
      setSuccess(true);
      setReason('');
      setAmount('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting guarantee claim:', err);
      setError('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Satisfaction Guarantee Claim</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Please log in to submit a guarantee claim.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Satisfaction Guarantee Claim</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>If you're not satisfied with the service provided, you can submit a claim under our satisfaction guarantee.</p>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Before submitting a claim, we recommend trying to resolve the issue directly with the service provider.
                  Claims are reviewed by our team and may take 3-5 business days to process.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {success ? (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your guarantee claim has been submitted successfully! Our team will review your claim and contact you within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="claim-reason" className="block text-sm font-medium text-gray-700">
                Reason for Claim
              </label>
              <div className="mt-1">
                <textarea
                  id="claim-reason"
                  name="claim-reason"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Please describe why you're not satisfied with the service..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="claim-amount" className="block text-sm font-medium text-gray-700">
                Claim Amount ($)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="claim-amount"
                  id="claim-amount"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
