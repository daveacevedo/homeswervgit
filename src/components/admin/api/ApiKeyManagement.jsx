import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { PlusIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { ApiKeyService } from '../../../lib/integrations';

export default function ApiKeyManagement() {
  const { hasPermission } = useAdmin();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: {},
    rate_limit: 1000,
    expires_at: ''
  });
  const [newKeyCreated, setNewKeyCreated] = useState(null);
  
  const canManageKeys = hasPermission('api_management', 'manage_keys');

  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ApiKeyService.getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError('Failed to load API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKeyData({
      ...newKeyData,
      [name]: value
    });
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    
    if (!canManageKeys) return;
    
    try {
      const keyData = {
        ...newKeyData,
        permissions: {
          read: true,
          write: false
        }
      };
      
      const newKey = await ApiKeyService.createApiKey(keyData);
      
      setNewKeyCreated(newKey);
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyData({
        name: '',
        permissions: {},
        rate_limit: 1000,
        expires_at: ''
      });
      setShowNewKeyForm(false);
    } catch (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key. Please try again.');
    }
  };

  const handleRevokeKey = async (id) => {
    if (!canManageKeys) return;
    
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      await ApiKeyService.revokeApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      console.error('Error revoking API key:', error);
      alert('Failed to revoke API key. Please try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">API Key Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage API keys for external integrations
          </p>
        </div>
        {canManageKeys && !showNewKeyForm && (
          <button
            type="button"
            onClick={() => setShowNewKeyForm(true)}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Generate API Key
          </button>
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
      
      {showNewKeyForm && canManageKeys && (
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Generate new API key</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Create a new API key for external integrations. Keep your API keys secure.</p>
            </div>
            <form className="mt-5 sm:flex sm:items-center" onSubmit={handleCreateKey}>
              <div className="w-full sm:max-w-xs">
                <label htmlFor="name" className="sr-only">
                  API Key Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="API Key Name"
                  value={newKeyData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mt-3 sm:ml-4 sm:mt-0">
                <input
                  type="number"
                  name="rate_limit"
                  id="rate_limit"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Rate Limit"
                  value={newKeyData.rate_limit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-3 sm:mt-0 sm:w-auto"
              >
                Generate
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
                onClick={() => setShowNewKeyForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
      {newKeyCreated && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">API Key Generated</h3>
              <div className="mt-2 text-sm text-green-700">
                <p className="font-medium">Your new API key:</p>
                <div className="mt-1 flex items-center">
                  <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                    {newKeyCreated.key_value}
                  </code>
                  <button
                    type="button"
                    className="ml-2 text-primary-600 hover:text-primary-500"
                    onClick={() => copyToClipboard(newKeyCreated.key_value)}
                  >
                    <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Copy to clipboard</span>
                  </button>
                </div>
                <p className="mt-2 text-sm text-red-600 font-bold">
                  Important: This key will only be displayed once. Please save it in a secure location.
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  onClick={() => setNewKeyCreated(null)}
                >
                  Dismiss
                </button>
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Rate Limit
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Used
                    </th>
                    {canManageKeys && (
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={canManageKeys ? 5 : 4} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={canManageKeys ? 5 : 4} className="py-10 text-center text-sm text-gray-500">
                        No API keys found
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr key={key.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {key.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {key.rate_limit} requests/hour
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(key.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never'}
                        </td>
                        {canManageKeys && (
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleRevokeKey(key.id)}
                            >
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Revoke {key.name}</span>
                            </button>
                          </td>
                        )}
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
