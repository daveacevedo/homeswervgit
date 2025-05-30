import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHomeowner } from '../../contexts/HomeownerContext';
import { 
  UserIcon, 
  HomeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CameraIcon,
  KeyIcon,
  BellIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const { homeownerProfile, updateHomeownerProfile } = useHomeowner();
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    projectUpdates: true,
    messages: true,
    marketing: false
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'card-1',
      type: 'visa',
      last4: '4242',
      expiry: '04/25',
      isDefault: true
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  useEffect(() => {
    if (homeownerProfile) {
      setPersonalInfo({
        firstName: homeownerProfile.firstName || '',
        lastName: homeownerProfile.lastName || '',
        email: user?.email || '',
        phone: homeownerProfile.phone || '',
        address: homeownerProfile.address || '',
        city: homeownerProfile.city || '',
        state: homeownerProfile.state || '',
        zipCode: homeownerProfile.zipCode || ''
      });
    }
  }, [homeownerProfile, user]);
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update profile in database
      await updateHomeownerProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        zipCode: personalInfo.zipCode
      });
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long.'
      });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update password
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please check your current password and try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Update notification settings
      await updateHomeownerProfile({
        notificationSettings
      });
      
      setMessage({
        type: 'success',
        text: 'Notification preferences updated successfully!'
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update notification preferences. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  const removePaymentMethod = (id) => {
    setPaymentMethods(methods => 
      methods.filter(method => method.id !== id)
    );
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Your Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings
          </p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="bg-white shadow sm:rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('personal')}
              className={`${
                activeTab === 'personal'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`${
                activeTab === 'payment'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Payment Methods
            </button>
          </nav>
        </div>
        
        {/* Message Alert */}
        {message.text && (
          <div className={`mx-6 mt-6 rounded-md p-4 ${
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
        
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="px-6 py-6">
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {homeownerProfile?.photoURL ? (
                      <img
                        src={homeownerProfile.photoURL}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-5">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      <CameraIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Change photo
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>
                
                {/* Name */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={personalInfo.email}
                        disabled
                        className="bg-gray-50 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HomeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={personalInfo.city}
                        onChange={handlePersonalInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={personalInfo.state}
                        onChange={handlePersonalInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={handlePersonalInfoChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
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
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="px-6 py-6">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure
                  </p>
                </div>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
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
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-10 pt-10 border-t border-gray-200">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Security</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Additional security options for your account
                </p>
              </div>
              
              <div className="mt-6">
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
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Set up two-factor authentication
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="px-6 py-6">
            <form onSubmit={handleNotificationSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose how and when you want to be notified
                  </p>
                </div>
                
                <div>
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-900">Notification Methods</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email"
                            name="email"
                            type="checkbox"
                            checked={notificationSettings.email}
                            onChange={handleNotificationChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email" className="font-medium text-gray-700">
                            Email notifications
                          </label>
                          <p className="text-gray-500">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms"
                            name="sms"
                            type="checkbox"
                            checked={notificationSettings.sms}
                            onChange={handleNotificationChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms" className="font-medium text-gray-700">
                            SMS notifications
                          </label>
                          <p className="text-gray-500">
                            Receive notifications via text message
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div>
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-900">Notification Types</legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="projectUpdates"
                            name="projectUpdates"
                            type="checkbox"
                            checked={notificationSettings.projectUpdates}
                            onChange={handleNotificationChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="projectUpdates" className="font-medium text-gray-700">
                            Project updates
                          </label>
                          <p className="text-gray-500">
                            Notifications about milestones, schedule changes, and project status
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="messages"
                            name="messages"
                            type="checkbox"
                            checked={notificationSettings.messages}
                            onChange={handleNotificationChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="messages" className="font-medium text-gray-700">
                            Messages
                          </label>
                          <p className="text-gray-500">
                            Notifications about new messages from service providers
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketing"
                            name="marketing"
                            type="checkbox"
                            checked={notificationSettings.marketing}
                            onChange={handleNotificationChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="marketing" className="font-medium text-gray-700">
                            Marketing
                          </label>
                          <p className="text-gray-500">
                            Receive updates about new features, promotions, and special offers
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
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
                      'Save Preferences'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Payment Methods Tab */}
        {activeTab === 'payment' && (
          <div className="px-6 py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Methods</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your payment methods for project payments
                </p>
              </div>
              
              <div>
                <div className="mt-1 space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-6">
                      <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add a payment method to pay for your projects.
                      </p>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {method.type === 'visa' && (
                              <svg className="h-8 w-8" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="4" fill="#2566AF" />
                                <path d="M15.4 21.9L17.1 14.1H19.5L17.8 21.9H15.4Z" fill="white" />
                                <path d="M24.8 14.3C24.2 14.1 23.3 13.9 22.2 13.9C19.9 13.9 18.3 15.1 18.3 16.8C18.3 18.1 19.5 18.8 20.4 19.2C21.3 19.6 21.6 19.9 21.6 20.3C21.6 20.9 20.9 21.2 20.2 21.2C19.2 21.2 18.7 21.1 17.9 20.7L17.5 20.5L17.1 22.6C17.8 22.9 19 23.1 20.2 23.1C22.7 23.1 24.2 21.9 24.2 20.1C24.2 19.1 23.6 18.3 22.2 17.7C21.4 17.3 20.9 17 20.9 16.6C20.9 16.2 21.3 15.8 22.2 15.8C22.9 15.8 23.5 15.9 23.9 16.1L24.2 16.2L24.8 14.3Z" fill="white" />
                                <path d="M28.6 14.1H26.8C26.2 14.1 25.8 14.3 25.6 14.9L22.7 21.9H25.2L25.7 20.6H28.2L28.5 21.9H30.7L28.6 14.1ZM26.3 18.8C26.5 18.3 27.2 16.4 27.2 16.4C27.2 16.4 27.4 15.9 27.5 15.6L27.6 16.3C27.6 16.3 28 18.4 28.1 18.8H26.3Z" fill="white" />
                                <path d="M13.7 14.1L11.4 19.3L11.1 18.1C10.6 16.6 9.2 15 7.6 14.2L9.7 21.9H12.3L16 14.1H13.7Z" fill="white" />
                                <path d="M9.2 14.1H5.3L5.2 14.3C8 15 9.9 17.2 10.6 19.7L9.7 15C9.6 14.4 9.4 14.2 9.2 14.1Z" fill="#FAA61A" />
                              </svg>
                            )}
                            {method.type === 'mastercard' && (
                              <svg className="h-8 w-8" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="4" fill="#16366F" />
                                <path d="M22.3 12H13.7V24H22.3V12Z" fill="#FF5F00" />
                                <path d="M14.4 18C14.4 15.5 15.6 13.3 17.4 12C16 10.9 14.2 10.3 12.3 10.3C7.9 10.3 4.3 13.8 4.3 18C4.3 22.2 7.9 25.7 12.3 25.7C14.2 25.7 16 25.1 17.4 24C15.6 22.7 14.4 20.5 14.4 18Z" fill="#EB001B" />
                                <path d="M31.7 18C31.7 22.2 28.1 25.7 23.7 25.7C21.8 25.7 20 25.1 18.6 24C20.4 22.7 21.6 20.5 21.6 18C21.6 15.5 20.4 13.3 18.6 12C20 10.9 21.8 10.3 23.7 10.3C28.1 10.3 31.7 13.8 31.7 18Z" fill="#F79E1B" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              •••• •••• •••• {method.last4}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expires {method.expiry}
                              {method.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!method.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefaultPaymentMethod(method.id)}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                              Set as default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removePaymentMethod(method.id)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <CreditCardIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add payment method
                </button>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Billing History</h3>
                <div className="mt-4">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Description
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Amount
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                            Oct 28, 2023
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Electrical Panel Upgrade - Final Payment
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            $1,250.00
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" className="text-primary-600 hover:text-primary-900">
                              Receipt
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                            Oct 15, 2023
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Bathroom Renovation - Milestone 2
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            $2,800.00
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" className="text-primary-600 hover:text-primary-900">
                              Receipt
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
