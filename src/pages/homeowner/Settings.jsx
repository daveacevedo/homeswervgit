import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const HomeownerSettings = () => {
  const { user, updateUser } = useAuth();
  const { userProfile } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Account settings
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    project_updates: true,
    messages: true,
    quotes: true,
    payment_reminders: true,
    marketing: false
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    share_contact_info: true,
    share_project_details: true,
    allow_reviews: true
  });

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    
    // In a real app, you would fetch notification and privacy settings from your database
    // For demo purposes, we'll use mock data
  }, [user]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // In a real app, you would update the email in your database
      // For demo purposes, we'll just show a success message
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update email
      // const { error } = await updateUser({ email });
      
      // if (error) throw error;
      
      setMessage({ type: 'success', text: 'Email updated successfully!' });
    } catch (error) {
      console.error('Error updating email:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating email' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // In a real app, you would update the password in your database
      // For demo purposes, we'll just show a success message
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update password
      // const { error } = await updateUser({ password });
      
      // if (error) throw error;
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handlePrivacyChange = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // In a real app, you would update the notification settings in your database
      // For demo purposes, we'll just show a success message
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Notification settings updated successfully!' });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating notification settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // In a real app, you would update the privacy settings in your database
      // For demo purposes, we'll just show a success message
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Privacy settings updated successfully!' });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred while updating privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6 space-y-6">
          {/* Account settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your account information and password.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {message.text && (
                <div className={`mb-4 p-4 rounded-md ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-6">
                {/* Update email */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Address</h4>
                  <form onSubmit={handleUpdateEmail} className="mt-2">
                    <div className="flex items-end space-x-4">
                      <div className="flex-grow">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          New Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Email'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Update password */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Password</h4>
                  <form onSubmit={handleUpdatePassword} className="mt-2 space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading || !password || !confirmPassword}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage how and when you receive notifications.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notification Methods</h4>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          name="email_notifications"
                          type="checkbox"
                          checked={notificationSettings.email_notifications}
                          onChange={() => handleNotificationChange('email_notifications')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Receive notifications via email.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_notifications"
                          name="sms_notifications"
                          type="checkbox"
                          checked={notificationSettings.sms_notifications}
                          onChange={() => handleNotificationChange('sms_notifications')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_notifications" className="font-medium text-gray-700">
                          SMS Notifications
                        </label>
                        <p className="text-gray-500">Receive notifications via text message.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Notification Types</h4>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="project_updates"
                          name="project_updates"
                          type="checkbox"
                          checked={notificationSettings.project_updates}
                          onChange={() => handleNotificationChange('project_updates')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="project_updates" className="font-medium text-gray-700">
                          Project Updates
                        </label>
                        <p className="text-gray-500">Receive notifications about updates to your projects.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="messages"
                          name="messages"
                          type="checkbox"
                          checked={notificationSettings.messages}
                          onChange={() => handleNotificationChange('messages')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="messages" className="font-medium text-gray-700">
                          Messages
                        </label>
                        <p className="text-gray-500">Receive notifications for new messages.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="quotes"
                          name="quotes"
                          type="checkbox"
                          checked={notificationSettings.quotes}
                          onChange={() => handleNotificationChange('quotes')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="quotes" className="font-medium text-gray-700">
                          Quotes
                        </label>
                        <p className="text-gray-500">Receive notifications when you get new quotes.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="payment_reminders"
                          name="payment_reminders"
                          type="checkbox"
                          checked={notificationSettings.payment_reminders}
                          onChange={() => handleNotificationChange('payment_reminders')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="payment_reminders" className="font-medium text-gray-700">
                          Payment Reminders
                        </label>
                        <p className="text-gray-500">Receive reminders about upcoming payments.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing"
                          name="marketing"
                          type="checkbox"
                          checked={notificationSettings.marketing}
                          onChange={() => handleNotificationChange('marketing')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketing" className="font-medium text-gray-700">
                          Marketing
                        </label>
                        <p className="text-gray-500">Receive marketing and promotional emails.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotificationSettings}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy Settings</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage what information is shared with service providers.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="share_contact_info"
                        name="share_contact_info"
                        type="checkbox"
                        checked={privacySettings.share_contact_info}
                        onChange={() => handlePrivacyChange('share_contact_info')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="share_contact_info" className="font-medium text-gray-700">
                        Share Contact Information
                      </label>
                      <p className="text-gray-500">Allow service providers to see your contact information.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="share_project_details"
                        name="share_project_details"
                        type="checkbox"
                        checked={privacySettings.share_project_details}
                        onChange={() => handlePrivacyChange('share_project_details')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="share_project_details" className="font-medium text-gray-700">
                        Share Project Details
                      </label>
                      <p className="text-gray-500">Allow your project details to be shared in the community section.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="allow_reviews"
                        name="allow_reviews"
                        type="checkbox"
                        checked={privacySettings.allow_reviews}
                        onChange={() => handlePrivacyChange('allow_reviews')}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="allow_reviews" className="font-medium text-gray-700">
                        Allow Reviews
                      </label>
                      <p className="text-gray-500">Allow service providers to request reviews from you.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePrivacySettings}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delete account */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Account</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerSettings;
