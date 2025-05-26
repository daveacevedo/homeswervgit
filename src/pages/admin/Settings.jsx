import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings = () => {
  const { user, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Home Service Hub',
    siteDescription: 'Connecting homeowners with trusted service providers',
    contactEmail: 'admin@homeservicehub.com',
    supportPhone: '(555) 123-4567',
    maintenanceMode: false
  });
  
  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    emailProvider: 'sendgrid',
    fromEmail: 'noreply@homeservicehub.com',
    replyToEmail: 'support@homeservicehub.com',
    emailFooter: 'Home Service Hub - Connecting homeowners with trusted service providers',
    enableEmailNotifications: true
  });
  
  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState({
    enableStripe: true,
    enableTwilio: true,
    enableGoogleMaps: true,
    enableZoom: false
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    twoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    sessionTimeout: 60
  });

  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleIntegrationSettingsChange = (e) => {
    const { name, checked } = e.target;
    setIntegrationSettings({
      ...integrationSettings,
      [name]: checked
    });
  };
  
  const handleSecuritySettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleSaveSettings = (settingsType) => {
    // This would be replaced with actual API calls to save settings
    console.log(`Saving ${settingsType} settings`);
    
    // Show success message
    alert(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Admin Settings</h1>
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`${
              activeTab === 'email'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`${
              activeTab === 'integrations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Security
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic settings for your platform.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Name
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6">
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Site Description
                      </label>
                      <textarea
                        name="siteDescription"
                        id="siteDescription"
                        rows={3}
                        value={generalSettings.siteDescription}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={generalSettings.contactEmail}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                        Support Phone
                      </label>
                      <input
                        type="text"
                        name="supportPhone"
                        id="supportPhone"
                        value={generalSettings.supportPhone}
                        onChange={handleGeneralSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="maintenanceMode"
                            name="maintenanceMode"
                            type="checkbox"
                            checked={generalSettings.maintenanceMode}
                            onChange={handleGeneralSettingsChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                            Maintenance Mode
                          </label>
                          <p className="text-gray-500">
                            When enabled, the site will display a maintenance message to all non-admin users.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('general')}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Email Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure email notifications and templates.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="emailProvider" className="block text-sm font-medium text-gray-700">
                        Email Provider
                      </label>
                      <select
                        id="emailProvider"
                        name="emailProvider"
                        value={emailSettings.emailProvider}
                        onChange={handleEmailSettingsChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailchimp">Mailchimp</option>
                        <option value="ses">Amazon SES</option>
                        <option value="smtp">Custom SMTP</option>
                      </select>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                        From Email
                      </label>
                      <input
                        type="email"
                        name="fromEmail"
                        id="fromEmail"
                        value={emailSettings.fromEmail}
                        onChange={handleEmailSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="replyToEmail" className="block text-sm font-medium text-gray-700">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        name="replyToEmail"
                        id="replyToEmail"
                        value={emailSettings.replyToEmail}
                        onChange={handleEmailSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6">
                      <label htmlFor="emailFooter" className="block text-sm font-medium text-gray-700">
                        Email Footer Text
                      </label>
                      <textarea
                        name="emailFooter"
                        id="emailFooter"
                        rows={2}
                        value={emailSettings.emailFooter}
                        onChange={handleEmailSettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableEmailNotifications"
                            name="enableEmailNotifications"
                            type="checkbox"
                            checked={emailSettings.enableEmailNotifications}
                            onChange={handleEmailSettingsChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableEmailNotifications" className="font-medium text-gray-700">
                            Enable Email Notifications
                          </label>
                          <p className="text-gray-500">
                            Send automated email notifications for various system events.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('email')}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Integration Settings */}
        {activeTab === 'integrations' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Integration Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage third-party service integrations.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableStripe"
                          name="enableStripe"
                          type="checkbox"
                          checked={integrationSettings.enableStripe}
                          onChange={handleIntegrationSettingsChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableStripe" className="font-medium text-gray-700">
                          Enable Stripe Integration
                        </label>
                        <p className="text-gray-500">
                          Process payments and subscriptions through Stripe.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableTwilio"
                          name="enableTwilio"
                          type="checkbox"
                          checked={integrationSettings.enableTwilio}
                          onChange={handleIntegrationSettingsChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableTwilio" className="font-medium text-gray-700">
                          Enable Twilio Integration
                        </label>
                        <p className="text-gray-500">
                          Send SMS notifications and enable phone verification.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableGoogleMaps"
                          name="enableGoogleMaps"
                          type="checkbox"
                          checked={integrationSettings.enableGoogleMaps}
                          onChange={handleIntegrationSettingsChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableGoogleMaps" className="font-medium text-gray-700">
                          Enable Google Maps Integration
                        </label>
                        <p className="text-gray-500">
                          Display maps and enable location-based features.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableZoom"
                          name="enableZoom"
                          type="checkbox"
                          checked={integrationSettings.enableZoom}
                          onChange={handleIntegrationSettingsChange}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableZoom" className="font-medium text-gray-700">
                          Enable Zoom Integration
                        </label>
                        <p className="text-gray-500">
                          Allow virtual consultations through Zoom.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('integration')}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure security and authentication options.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="requireEmailVerification"
                            name="requireEmailVerification"
                            type="checkbox"
                            checked={securitySettings.requireEmailVerification}
                            onChange={handleSecuritySettingsChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="requireEmailVerification" className="font-medium text-gray-700">
                            Require Email Verification
                          </label>
                          <p className="text-gray-500">
                            Users must verify their email address before accessing the platform.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="twoFactorAuth"
                            name="twoFactorAuth"
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={handleSecuritySettingsChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                            Enable Two-Factor Authentication
                          </label>
                          <p className="text-gray-500">
                            Require two-factor authentication for admin accounts.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        name="passwordMinLength"
                        id="passwordMinLength"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={handleSecuritySettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        name="sessionTimeout"
                        id="sessionTimeout"
                        min="15"
                        max="1440"
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecuritySettingsChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="passwordRequireSpecialChar"
                            name="passwordRequireSpecialChar"
                            type="checkbox"
                            checked={securitySettings.passwordRequireSpecialChar}
                            onChange={handleSecuritySettingsChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="passwordRequireSpecialChar" className="font-medium text-gray-700">
                            Require Special Characters in Passwords
                          </label>
                          <p className="text-gray-500">
                            Passwords must contain at least one special character.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('security')}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
