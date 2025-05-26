import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { IntegrationService } from '../../../lib/integrations';

export default function IntegrationManagement() {
  const { hasPermission } = useAdmin();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const canManageIntegrations = hasPermission('integrations', 'manage_integrations');

  useEffect(() => {
    fetchIntegrations();
  }, []);

  async function fetchIntegrations() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await IntegrationService.getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setError('Failed to load integrations. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (integration) => {
    if (!canManageIntegrations) return;
    
    try {
      const updatedIntegration = await IntegrationService.toggleIntegrationStatus(
        integration.id, 
        !integration.is_active
      );
      
      // Update local state
      setIntegrations(integrations.map(i => 
        i.id === updatedIntegration.id ? updatedIntegration : i
      ));
    } catch (error) {
      console.error('Error toggling integration status:', error);
      alert('Failed to update integration status. Please try again.');
    }
  };

  // Function to get provider-specific icon or default
  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return '🔍';
      case 'stripe':
        return '💳';
      case 'twilio':
        return '📱';
      case 'pabbly':
        return '🔄';
      default:
        return '🔌';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integration Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage third-party service integrations
          </p>
        </div>
        {canManageIntegrations && (
          <Link
            to="/admin/integrations/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Integration
          </Link>
        )}
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
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Integration
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Provider
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
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
                  ) : integrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                        No integrations found
                      </td>
                    </tr>
                  ) : (
                    integrations.map((integration) => (
                      <tr key={integration.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {integration.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="mr-2">{getProviderIcon(integration.provider)}</span>
                          {integration.provider}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            integration.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {integration.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(integration.updated_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            {canManageIntegrations && (
                              <>
                                <Link
                                  to={`/admin/integrations/${integration.id}/edit`}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                  <span className="sr-only">Edit {integration.name}</span>
                                </Link>
                                
                                <button
                                  className={`${
                                    integration.is_active
                                      ? 'text-red-600 hover:text-red-900'
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                  onClick={() => handleToggleStatus(integration)}
                                >
                                  {integration.is_active ? (
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                  <span className="sr-only">
                                    {integration.is_active ? 'Deactivate' : 'Activate'} {integration.name}
                                  </span>
                                </button>
                              </>
                            )}
                          </div>
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
