import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import EscrowPaymentsList from '../../components/transactions/EscrowPaymentsList';
import { LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function SecurePayments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          status,
          provider:provider_id (
            id,
            business_name
          )
        `)
        .eq('homeowner_id', user.id)
        .in('status', ['in_progress', 'pending'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Secure Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your secure escrow payments to service providers
        </p>
      </div>
      
      {showInfo && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <LockClosedIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">About Secure Escrow Payments</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Our secure escrow payment system protects both you and the service provider. Here's how it works:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>You deposit funds into our secure escrow account</li>
                  <li>The service provider completes the agreed-upon work</li>
                  <li>You verify that the work meets your satisfaction</li>
                  <li>Once approved, the funds are released to the service provider</li>
                </ul>
                <p className="mt-2">
                  This ensures that you only pay for work that meets your expectations, and service providers know that funds are available for completed work.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowInfo(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <EscrowPaymentsList role="homeowner" />
      
      {!loading && projects.length > 0 && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Make a New Escrow Payment</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Select a project to make a secure escrow payment
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.title}</p>
                    <p className="text-sm text-gray-500">
                      Provider: {project.provider?.business_name || 'Unknown'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/homeowner/projects/${project.id}/payments/new`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <CreditCardIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                    Make Payment
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
