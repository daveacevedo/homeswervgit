import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { 
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, logout, deleteAccount } = useAuth();
  const { homeownerProfile } = useHomeowner();
  
  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      projectUpdates: true,
      messages: true,
      promotions: false
    },
    push: {
      projectUpdates: true,
      messages: true,
      promotions: false
    },
    sms: {
      projectUpdates: false,
      messages: false,
      promotions: false
    }
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'verified',
    shareContactInfo: 'providers',
    allowReviews: true,
    dataCollection: true
  });
  
  // Account Deletion
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (category, channel, checked) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [category]: checked
      }
    }));
  };
  
  const handlePrivacySettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveSettings = async (settingsType) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to the database
      setMessage({
        type: 'success',
        text: `${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`
      });
    } catch (error) {
      console.error(`Error saving ${settingsType} settings:`, error);
      setMessage({
        type: 'error',
        text: `Failed to save ${settingsType} settings. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      setMessage({
        type: 'error',
        text: 'Email address does not match. Please try again.'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call the delete account function
      await deleteAccount();
      // Redirect to home page would happen automatically after logout
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete account. Please try again or contact support.'
      });
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page would happen automatically
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage({
        type: 'error',
        text: 'Failed to log out. Please try again.'
      });
    }
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="md:grid md:grid-cols-12 md:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 md:col-span-3 md:py-0 md:px-0 border-b md:border-b-0 md:border-r border-gray-200">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('general')}
                className={`${
                  activeSection === 'general'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full`}
              >
                <Cog6ToothIcon
                  className={`${
                    activeSection === 'general'
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">General</span>
              </button>
              
              <button
                onClick={() => setActiveSection('notifications')}
                className={`${
                  activeSection === 'notifications'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full`}
              >
                <BellIcon
                  className={`${
                    activeSection === 'notifications'
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveSection('privacy')}
                className={`${
                  activeSection === 'privacy'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full`}
              >
                <ShieldCheckIcon
                  className={`${
                    activeSection === 'privacy'
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">Privacy & Security</span>
              </button>
              
              <button
                onClick={() => setActiveSection('account')}
                className={`${
                  activeSection === 'account'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full`}
              >
                <DocumentTextIcon
                  className={`${
                    activeSection === 'account'
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                <span className="truncate">Account</span>
              </button>
            </nav>
            
            <div className="mt-8 px-3">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 w-full"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                Sign out
              </button>
            </div>
          </aside>
          
          {/* Main Content */}
          <div className="py-6 px-4 sm:p-6 md:col-span-9">
            {/* Message Alert */}
            {message.text && (
              <div className={`mb-6 rounded-md p-4 ${
                message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {message.type === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* General Settings */}
            {activeSection === 'general' && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your experience with Home Swerv
                </p>
                
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <div className="mt-1">
                        <select
                          id="language"
                          name="language"
                          value={generalSettings.language}
                          onChange={handleGeneralSettingsChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Time Zone
                      </label>
                      <div className="mt-1">
                        <select
                          id="timezone"
                          name="timezone"
                          value={generalSettings.timezone}
                          onChange={handleGeneralSettingsChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/Anchorage">Alaska Time (AKT)</option>
                          <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                        Date Format
                      </label>
                      <div className="mt-1">
                        <select
                          id="dateFormat"
                          name="dateFormat"
                          value={generalSettings.dateFormat}
                          onChange={handleGeneralSettingsChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
                        Time Format
                      </label>
                      <div className="mt-1">
                        <select
                          id="timeFormat"
                          name="timeFormat"
                          value={generalSettings.timeFormat}
                          onChange={handleGeneralSettingsChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="12h">12-hour (AM/PM)</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('general')}
                      disabled={loading}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
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
                        'Save Settings'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose how and when you want to be notified
                </p>
                
                <div className="mt-6">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Notification Type
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            Push
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                            SMS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Project Updates
                            <p className="text-xs text-gray-500 font-normal mt-1">
                              Notifications about milestones, schedule changes, and project status
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.email.projectUpdates}
                              onChange={(e) => handleNotificationChange('projectUpdates', 'email', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.push.projectUpdates}
                              onChange={(e) => handleNotificationChange('projectUpdates', 'push', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.sms.projectUpdates}
                              onChange={(e) => handleNotificationChange('projectUpdates', 'sms', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Messages
                            <p className="text-xs text-gray-500 font-normal mt-1">
                              Notifications about new messages from service providers
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.email.messages}
                              onChange={(e) => handleNotificationChange('messages', 'email', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.push.messages}
                              onChange={(e) => handleNotificationChange('messages', 'push', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.sms.messages}
                              onChange={(e) => handleNotificationChange('messages', 'sms', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            Promotions & Updates
                            <p className="text-xs text-gray-500 font-normal mt-1">
                              Marketing messages, new features, and special offers
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.email.promotions}
                              onChange={(e) => handleNotificationChange('promotions', 'email', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.push.promotions}
                              onChange={(e) => handleNotificationChange('promotions', 'push', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings.sms.promotions}
                              onChange={(e) => handleNotificationChange('promotions', 'sms', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('notification')}
                      disabled={loading}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
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
                        'Save Settings'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy & Security Settings */}
            {activeSection === 'privacy' && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy & Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your privacy preferences and security settings
                </p>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Control who can see your profile information
                    </p>
                    <div className="mt-2">
                      <select
                        id="profileVisibility"
                        name="profileVisibility"
                        value={privacySettings.profileVisibility}
                        onChange={handlePrivacySettingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="public">Public - Anyone can view your profile</option>
                        <option value="verified">Verified Users - Only verified users can view your profile</option>
                        <option value="providers">Service Providers - Only service providers you've connected with</option>
                        <option value="private">Private - Your profile is hidden</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Contact Information Sharing</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Control who can see your contact information
                    </p>
                    <div className="mt-2">
                      <select
                        id="shareContactInfo"
                        name="shareContactInfo"
                        value={privacySettings.shareContactInfo}
                        onChange={handlePrivacySettingChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="none">No one</option>
                        <option value="providers">Service providers I've hired</option>
                        <option value="all">All service providers</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="allowReviews"
                        name="allowReviews"
                        type="checkbox"
                        checked={privacySettings.allowReviews}
                        onChange={handlePrivacySettingChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allowReviews" className="font-medium text-gray-700">
                        Allow reviews
                      </label>
                      <p className="text-gray-500">
                        Allow service providers to leave reviews about working with you
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="dataCollection"
                        name="dataCollection"
                        type="checkbox"
                        checked={privacySettings.dataCollection}
                        onChange={handlePrivacySettingChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="dataCollection" className="font-medium text-gray-700">
                        Data collection
                      </label>
                      <p className="text-gray-500">
                        Allow us to collect usage data to improve our services
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Security</h4>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        <LockClosedIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Change Password
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="twoFactor"
                            name="twoFactor"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="twoFactor" className="font-medium text-gray-700">
                            Enable two-factor authentication
                          </label>
                          <p className="text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('privacy')}
                      disabled={loading}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
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
                        'Save Settings'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account details and preferences
                </p>
                
                <div className="mt-6 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm text-gray-900">{user?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Account Type</span>
                        <span className="text-sm text-gray-900">Homeowner</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Member Since</span>
                        <span className="text-sm text-gray-900">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Linked Accounts</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Connect your account with other services
                    </p>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                          <span className="ml-3 text-sm text-gray-900">Google</span>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Connect
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="h-6 w-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="ml-3 text-sm text-gray-900">Facebook</span>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <TrashIcon className="h-5 w-5 text-red-500 mr-2" />
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. All your data, including projects, messages, and profile information will be permanently deleted.
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 font-medium">
                        To confirm, please type your email address:
                      </p>
                      <input
                        type="email"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        placeholder={user?.email}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmation !== user?.email}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm ${
                    (loading || deleteConfirmation !== user?.email) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
