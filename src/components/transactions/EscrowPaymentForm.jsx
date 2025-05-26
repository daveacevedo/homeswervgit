import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CreditCardIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function EscrowPaymentForm({ projectId, providerId, milestoneId, amount, onSuccess }) {
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [releaseConditions, setReleaseConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [project, setProject] = useState(null);
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getCurrentUser();
    
    if (projectId) {
      fetchProjectDetails();
    }
    if (milestoneId) {
      fetchMilestoneDetails();
    }
  }, [projectId, milestoneId]);

  const fetchProjectDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      setProject(data);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    }
  };

  const fetchMilestoneDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('id', milestoneId)
        .single();
      
      if (error) throw error;
      
      setMilestone(data);
      if (data.description) {
        setReleaseConditions(`Completion of milestone: ${data.description}`);
      }
    } catch (err) {
      console.error('Error fetching milestone details:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to make an escrow payment');
      return;
    }
    
    if (!releaseConditions.trim()) {
      setError('Please specify the conditions for releasing the payment');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // First create a transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          project_id: projectId,
          payer_id: user.id,
          recipient_id: providerId,
          amount: amount,
          status: 'pending',
          transaction_type: 'escrow',
          payment_method: paymentMethod
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Then create an escrow payment record
      const { error: escrowError } = await supabase
        .from('escrow_payments')
        .insert({
          transaction_id: transactionData.id,
          project_id: projectId,
          milestone_id: milestoneId || null,
          amount: amount,
          release_conditions: releaseConditions.trim(),
          status: 'held'
        });
      
      if (escrowError) throw escrowError;
      
      // Update the transaction status to completed (payment held in escrow)
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'completed', transaction_date: new Date().toISOString() })
        .eq('id', transactionData.id);
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creating escrow payment:', err);
      setError('Failed to process escrow payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (!user) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Secure Escrow Payment</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Please log in to make an escrow payment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Secure Escrow Payment</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Escrow payments protect both you and the service provider. Funds are held securely until the specified conditions are met.
          </p>
        </div>
        
        {success ? (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your escrow payment has been processed successfully! The funds will be held securely until the specified conditions are met.
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
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Project:</p>
                  <p className="text-sm text-gray-900">{project?.title || 'Loading...'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Amount:</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</p>
                </div>
              </div>
              {milestone && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Milestone:</p>
                  <p className="text-sm text-gray-900">{milestone.description}</p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="release-conditions" className="block text-sm font-medium text-gray-700">
                Release Conditions
              </label>
              <div className="mt-1">
                <textarea
                  id="release-conditions"
                  name="release-conditions"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Specify the conditions that must be met for the funds to be released..."
                  value={releaseConditions}
                  onChange={(e) => setReleaseConditions(e.target.value)}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Be specific about what needs to be completed for the payment to be released.
              </p>
            </div>
            
            <div className="mt-4">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="payment-method"
                name="payment-method"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>
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
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCardIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Process Escrow Payment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
