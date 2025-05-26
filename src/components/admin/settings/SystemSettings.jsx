import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../contexts/AdminContext';

export default function SystemSettings() {
  const { hasPermission, createAuditLog } = useAdmin();
  const [settings, setSettings] = useState({
    site_name: 'ServiceConnect Pro',
    contact_email: 'support@serviceconnectpro.com',
    enable_registration: true,
    require_verification: true,
    maintenance_mode: false,
    default_currency: 'USD',
    booking_lead_time: 24,
    max_file_size: 5,
    allowed_file_types: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const canManageSettings = hasPermission('system', 'manage_settings');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is fine for initial setup
        throw error;
      }
      
      if (data) {
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load system settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    if (!canManageSettings) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      const { data, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let result;
      
      if (data) {
        // Update existing settings
        result = await supabase
          .from('system_settings')
          .update({
            settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('system_settings')
          .insert([{
            settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
      }
      
      if (result.error) throw result.error;
      
      await createAuditLog(
        'update',
        'system_settings',
        data ? data.id : 'new',
        { action: 'Updated system settings' }
      );
      
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!canManageSettings) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">Access Denied</h2>
        <p className="mt-2 text-sm text-gray-500">
          You don't have permission to manage system settings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure global system settings and preferences
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
      
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings}>
          <div className="space-y-8">
            {/* General Settings */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="site_name"
                        id="site_name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.site_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="contact_email"
                        id="contact_email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.contact_email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="default_currency" className="block text-sm font-medium text-gray-700">
                      Default Currency
                    </label>
                    <div className="mt-1">
                      <select
                        id="default_currency"
                        name="default_currency"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.default_currency}
                        onChange={handleInputChange}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="booking_lead_time" className="block text-sm font-medium text-gray-700">
                      Booking Lead Time (hours)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="booking_lead_time"
                        id="booking_lead_time"
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.booking_lead_time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="enable_registration"
                          name="enable_registration"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={settings.enable_registration}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enable_registration" className="font-medium text-gray-700">
                          Enable User Registration
                        </label>
                        <p className="text-gray-500">Allow new users to register on the platform.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="require_verification"
                          name="require_verification"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={settings.require_verification}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="require_verification" className="font-medium text-gray-700">
                          Require Provider Verification
                        </label>
                        <p className="text-gray-500">Require service providers to be verified before they can offer services.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="maintenance_mode"
                          name="maintenance_mode"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={settings.maintenance_mode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                          Maintenance Mode
                        </label>
                        <p className="text-gray-500">Put the site in maintenance mode. Only administrators will be able to access the site.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* File Upload Settings */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">File Upload Settings</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="max_file_size" className="block text-sm font-medium text-gray-700">
                      Maximum File Size (MB)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="max_file_size"
                        id="max_file_size"
                        min="1"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.max_file_size}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="allowed_file_types" className="block text-sm font-medium text-gray-700">
                      Allowed File Types
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="allowed_file_types"
                        id="allowed_file_types"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.allowed_file_types}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Comma-separated list of file extensions (e.g., .jpg,.png,.pdf)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Settings */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Settings</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700">
                      SMTP Host
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="smtp_host"
                        id="smtp_host"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_host}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="smtp_port"
                        id="smtp_port"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_port}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700">
                      SMTP Username
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="smtp_user"
                        id="smtp_user"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_user}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_password" className="block text-sm font-medium text-gray-700">
                      SMTP Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="smtp_password"
                        id="smtp_password"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_from_email" className="block text-sm font-medium text-gray-700">
                      From Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="smtp_from_email"
                        id="smtp_from_email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_from_email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="smtp_from_name" className="block text-sm font-medium text-gray-700">
                      From Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="smtp_from_name"
                        id="smtp_from_name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.smtp_from_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
