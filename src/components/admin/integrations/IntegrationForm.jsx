import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';
import { IntegrationService } from '../../../lib/integrations';

export default function IntegrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAdmin();
  const [integration, setIntegration] = useState({
    name: '',
    provider: '',
    config: {},
    is_active: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNew, setIsNew] = useState(!id);
  
  const canManageIntegrations = hasPermission('integrations', 'manage_integrations');
  
  useEffect(() => {
    if (!canManageIntegrations) {
      navigate('/admin/integrations');
      return;
    }
    
    if (id) {
      fetchIntegration();
    }
  }, [id, canManageIntegrations]);
  
  const fetchIntegration = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await IntegrationService.getIntegrationById(id);
      setIntegration(data);
    } catch (error) {
      console.error('Error fetching integration:', error);
      setError('Failed to load integration. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIntegration(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleConfigChange = (key, value) => {
    setIntegration(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canManageIntegrations) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (isNew) {
        await IntegrationService.createIntegration(integration);
      } else {
        await IntegrationService.updateIntegration(id, integration);
      }
      
      navigate('/admin/integrations');
    } catch (error) {
      console.error('Error saving integration:', error);
      setError('Failed to save integration. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Define config fields based on provider
  const getConfigFields = () => {
    switch (integration.provider.toLowerCase()) {
      case 'stripe':
        return [
          { key: 'api_key', label: 'API Key', type: 'password' },
          { key: 'webhook_secret', label: 'Webhook Secret', type: 'password' }
        ];
      case 'google':
        return [
          { key: 'api_key', label: 'API Key', type: 'password' },
          { key: 'client_id', label: 'Client ID', type: 'text' },
          { key: 'client_secret', label: 'Client Secret', type: 'password' }
        ];
      case 'twilio':
        return [
          { key: 'account_sid', label: 'Account SID', type: 'text' },
          { key: 'auth_token', label: 'Auth Token', type: 'password' },
          { key: 'phone_number', label: 'Phone Number', type: 'text' }
        ];
      case 'pabbly':
        return [
          { key: 'api_key', label: 'API Key', type: 'password' },
          { key: 'webhook_url', label: 'Webhook URL', type: 'text' }
        ];
      default:
        return [
          { key: 'api_key', label: 'API Key', type: 'password' }
        ];
    }
  };
  
  if (loading && !isNew) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {isNew ? 'Add Integration' : `Edit ${integration.name}`}
          </h2>
        </div>
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
      
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">Integration Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure the integration settings for third-party services.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Integration Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={integration.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="provider" className="block text-sm font-medium leading-6 text-gray-900">
                  Provider
                </label>
                <div className="mt-2">
                  <select
                    id="provider"
                    name="provider"
                    value={integration.provider}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    required
                  >
                    <option value="">Select Provider</option>
                    <option value="Google">Google Business API</option>
                    <option value="Stripe">Stripe Payments</option>
                    <option value="Twilio">Twilio SMS</option>
                    <option value="Pabbly">Pabbly Connect</option>
                    <option value="Custom">Custom Integration</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={integration.is_active}
                      onChange={(e) => setIntegration(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="is_active" className="font-medium text-gray-900">
                      Active
                    </label>
                    <p className="text-gray-500">Enable this integration for use in the application.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {integration.provider && (
            <div className="pt-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Configuration</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the required credentials for {integration.provider}.
                </p>
              </div>
              
              <div className="mt-6 space-y-6">
                {getConfigFields().map((field) => (
                  <div key={field.key} className="sm:col-span-4">
                    <label htmlFor={field.key} className="block text-sm font-medium leading-6 text-gray-900">
                      {field.label}
                    </label>
                    <div className="mt-2">
                      <input
                        type={field.type}
                        id={field.key}
                        value={integration.config[field.key] || ''}
                        onChange={(e) => handleConfigChange(field.key, e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end gap-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/integrations')}
              className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md bg-primary-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
