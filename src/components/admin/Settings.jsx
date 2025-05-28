import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Home Renovation Platform',
    siteDescription: 'Connect homeowners with trusted service providers',
    contactEmail: 'support@renovationplatform.com',
    supportPhone: '+1 (555) 123-4567',
    maintenanceMode: false
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    emailProvider: 'smtp',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@renovationplatform.com',
    smtpPassword: '••••••••••••',
    senderName: 'Renovation Platform',
    senderEmail: 'notifications@renovationplatform.com',
    enableEmailNotifications: true
  });
  
  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymentGateway: 'stripe',
    currencyCode: 'USD',
    testMode: true,
    platformFeePercentage: 5,
    minimumWithdrawalAmount: 50,
    autoPayoutEnabled: false,
    payoutSchedule: 'weekly'
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    twoFactorAuthEnabled: false,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordRequireNumber: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    recaptchaEnabled: true
  });

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    await saveSettings('general', generalSettings);
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    await saveSettings('email', emailSettings);
  };
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    await saveSettings('payment', paymentSettings);
  };
  
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    await saveSettings('security', securitySettings);
  };

  const saveSettings = async (type, data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // In a real application, this would save to the database
      // For this example, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} settings updated successfully.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error(`Error saving ${type} settings:`, err);
      setError(`Failed to save ${type} settings. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Platform Settings</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* General Settings */}
        {activeTab === 'general' && (
          <form onSubmit={handleGeneralSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                  Support Phone
                </label>
                <input
                  type="text"
                  id="supportPhone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={generalSettings.supportPhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="maintenanceMode"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="maintenanceMode" className="font-medium text-gray-700">
                    Maintenance Mode
                  </label>
                  <p className="text-gray-500">
                    When enabled, the site will display a maintenance message to all users except administrators.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
        
        {/* Email Settings */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="emailProvider" className="block text-sm font-medium text-gray-700">
                  Email Provider
                </label>
                <select
                  id="emailProvider"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={emailSettings.emailProvider}
                  onChange={(e) => setEmailSettings({...emailSettings, emailProvider: e.target.value})}
                >
                  <option value="smtp">SMTP</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailchimp">Mailchimp</option>
                  <option value="aws_ses">AWS SES</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    id="smtpHost"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    id="smtpPort"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    id="smtpUsername"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    id="smtpPassword"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableEmailNotifications"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={emailSettings.enableEmailNotifications}
                    onChange={(e) => setEmailSettings({...emailSettings, enableEmailNotifications: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableEmailNotifications" className="font-medium text-gray-700">
                    Enable Email Notifications
                  </label>
                  <p className="text-gray-500">
                    Send automated email notifications for important events (new projects, messages, etc.).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
        
        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
                  Payment Gateway
                </label>
                <select
                  id="paymentGateway"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={paymentSettings.paymentGateway}
                  onChange={(e) => setPaymentSettings({...paymentSettings, paymentGateway: e.target.value})}
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="square">Square</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currencyCode"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={paymentSettings.currencyCode}
                  onChange={(e) => setPaymentSettings({...paymentSettings, currencyCode: e.target.value})}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="testMode"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={paymentSettings.testMode}
                    onChange={(e) => setPaymentSettings({...paymentSettings, testMode: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="testMode" className="font-medium text-gray-700">
                    Test Mode
                  </label>
                  <p className="text-gray-500">
                    When enabled, payments will be processed in sandbox/test mode.
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="platformFeePercentage" className="block text-sm font-medium text-gray-700">
                  Platform Fee (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="platformFeePercentage"
                    min="0"
                    max="100"
                    step="0.1"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    value={paymentSettings.platformFeePercentage}
                    onChange={(e) => setPaymentSettings({...paymentSettings, platformFeePercentage: parseFloat(e.target.value)})}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Percentage fee charged by the platform on each transaction.
                </p>
              </div>
              
              <div>
                <label htmlFor="minimumWithdrawalAmount" className="block text-sm font-medium text-gray-700">
                  Minimum Withdrawal Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minimumWithdrawalAmount"
                    min="0"
                    step="1"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                    value={paymentSettings.minimumWithdrawalAmount}
                    onChange={(e) => setPaymentSettings({...paymentSettings, minimumWithdrawalAmount: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autoPayoutEnabled"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={paymentSettings.autoPayoutEnabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, autoPayoutEnabled: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="autoPayoutEnabled" className="font-medium text-gray-700">
                    Automatic Payouts
                  </label>
                  <p className="text-gray-500">
                    Automatically process payouts to service providers based on the schedule below.
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="payoutSchedule" className="block text-sm font-medium text-gray-700">
                  Payout Schedule
                </label>
                <select
                  id="payoutSchedule"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={paymentSettings.payoutSchedule}
                  onChange={(e) => setPaymentSettings({...paymentSettings, payoutSchedule: e.target.value})}
                  disabled={!paymentSettings.autoPayoutEnabled}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <form onSubmit={handleSecuritySubmit}>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireEmailVerification"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={securitySettings.requireEmailVerification}
                    onChange={(e) => setSecuritySettings({...securitySettings, requireEmailVerification: e.target.checked})}
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
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="twoFactorAuthEnabled"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={securitySettings.twoFactorAuthEnabled}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuthEnabled: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="twoFactorAuthEnabled" className="font-medium text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                  <p className="text-gray-500">
                    Allow users to enable two-factor authentication for their accounts.
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  id="passwordMinLength"
                  min="6"
                  max="32"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="passwordRequireSpecialChar"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={securitySettings.passwordRequireSpecialChar}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecialChar: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="passwordRequireSpecialChar" className="font-medium text-gray-700">
                    Require Special Character
                  </label>
                  <p className="text-gray-500">
                    Passwords must contain at least one special character.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="passwordRequireNumber"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={securitySettings.passwordRequireNumber}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumber: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="passwordRequireNumber" className="font-medium text-gray-700">
                    Require Number
                  </label>
                  <p className="text-gray-500">
                    Passwords must contain at least one number.
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  min="5"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Users will be automatically logged out after this period of inactivity.
                </p>
              </div>
              
              <div>
                <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                  Maximum Login Attempts
                </label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Account will be temporarily locked after this many failed login attempts.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="recaptchaEnabled"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={securitySettings.recaptchaEnabled}
                    onChange={(e) => setSecuritySettings({...securitySettings, recaptchaEnabled: e.target.checked})}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="recaptchaEnabled" className="font-medium text-gray-700">
                    Enable reCAPTCHA
                  </label>
                  <p className="text-gray-500">
                    Use Google reCAPTCHA to protect forms from spam and abuse.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
